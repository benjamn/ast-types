"use strict";
/**
 @exports GlobalScope
 @exports BlockScope
 @exports CatchScope
 @exports FunctionScope
 @exports ModuleScope
 @exports createScopeFromPath
 */
const visit = require('../../').visit;
const n = require('../types').namedTypes;
const has = require('has');

class Scope {
  constructor(type, parent) {
    this.type = type;
    if (parent instanceof Scope) {
      this.parent = parent;
    }
    else if (typeof parent === 'function') {
      Object.defineProperty(this, `parent`, {
        get: parent
      });
    }
    else {
      this.parent = null;
    }
    this.bindings = Object.create(null);
    this.types = Object.create(null);
    Object.freeze(this);
  }

  hasOwnBinding(name) {
    return has(this.bindings, name);
  }
  hasOwnType(name) {
    return has(this.types, name);
  }
  addBinding(path, kind) {
    if (this.acceptedVariableKinds.indexOf(kind) >= 0) {
      let bind;
      if (kind === 'type') {
        bind = (name, idPath) => {
          if (!this.hasOwnType(name)) {
            this.types[name] = idPath;
            return;
          }
          throw Error(`Type for ${kind} ${name} already exists.`);
        }
      }
      else {
        bind = (name, idPath) => {
          if (!this.hasOwnBinding(name)) {
            this.bindings[name] = [idPath];
            return;
          }
          this.bindings[name].push(idPath);
          //throw Error(`Variable for ${kind} ${name} already exists.`);
        }
      }
      addPattern(path, bind);
      return this;
    }
    else if (this.parent) {
      return this.parent.addBinding(path, kind);
    }
    throw Error(`No scope in chain accepts variable kind: ${kind}.`)
  }

  lookupBinding(name, kind) {
    if (this.hasOwnBinding(name)) {
      if (!kind || this.acceptedVariableKinds.indexOf(kind) >= 0) {
        return this;
      }
    }
    if (this.parent) {
      return this.parent.lookupBinding(name, kind);
    }
    throw Error(`No scope in chain has variable ${kind?`${kind} `:``}${name}.`)
  }
}

// special, it doesn't have a path, since it doesn't have a parent
const GlobalScope = class GlobalScope extends Scope {
  constructor() {
    super(`GlobalScope`, null);
  }

  /**
   Global scopes are never introduced by a path.
   */
  static introducedByPath(path) {
    return false;
  }
}
GlobalScope.prototype.acceptedVariableKinds = Object.freeze([
  `var`, `let`, `const`, `type`
]);

const BlockScope = class BlockScope extends Scope {
  constructor(getParent) {
    super(`BlockScope`, getParent);
  }

  /**
   * Block statements sometimes nest in places we don't want
   * to introduce scopes at
   * * Function => BlockStatement
   * * Program => BlockStatement
   *
   * NOTE: CatchClause introduces 2 scopes! 1 Catch 1 Block
   * visible by doing:
   *
   * try {} catch (e) {
   *   let e;  * e doesn't complain about redefinition
   * }
   */
  static introducedByPath(path) {
    if (n.BlockStatement.check(path.node)) {
      if (!path.parent) {
        throw Error(`Unsure of scoping of BlockStatement without parent. Function and Program could be the real Scope.`);
      }
      const parent = path.parent.node;
      if (!n.Function.check(parent) && 
        !n.Program.check(parent)) {
        return true;
      }
    }
    return false;
  }
}
BlockScope.prototype.acceptedVariableKinds = Object.freeze([
  `let`, `const`
]);

const CatchScope = class CatchScope extends Scope {
  constructor(getParent) {
    super(`CatchScope`, getParent);
  }

  static introducedByPath(path) {
    return n.CatchClause.check(path.node);
  }
}
CatchScope.prototype.acceptedVariableKinds = Object.freeze([
  `catch`
]);
const FunctionScope = class FunctionScope extends Scope {
  constructor(getParent) {
    super(`FunctionScope`, getParent);
  }

  static introducedByPath(path) {
    return n.Function.check(path.node);
  }
}
FunctionScope.prototype.acceptedVariableKinds = Object.freeze([
  `var`, `let`, `const`, `param`, `type`
]);

const ModuleScope = class ModuleScope extends Scope {
  constructor(getParent) {
    super(`FunctionScope`, getParent);
  }

  /**
   Module scopes are never introduced by a path.
   */
  static introducedByPath(path) {
    return false;
  }
}
ModuleScope.prototype.acceptedVariableKinds = Object.freeze([
  `var`, `let`, `const`, `import`, `type`
]);

// Points to check for bailing out of scan and
// Points to add variables to current scope
//
// @private
const SCANNERS = {
  visitNode: null,
  visitFunction(path, currentScope) {
    for (let i = 0; i < path.node.params.length; i++) {
      currentScope.addBinding(path.get('params', i), 'function');
    }
  },
  visitVariableDeclaration(path, currentScope) {
    for (let i = 0; i < path.node.declarations.length; i++) {
      currentScope.addBinding(path.get('declarations', i, 'id'), path.node.kind);
    }
  },
  visitCatchClause(path, currentScope) {
    currentScope.addBinding(path.get('param'), 'catch');
  },
  visitImportDeclaration(path, currentScope) {
    for (let i = 0; i < path.node.specifiers.length; i++) {
      currentScope.addBinding(path.get('specifiers', i, 'local'), 'import');
    }
  }
};

/**
 * @param {Scope} root - should be a GlobalScope, FunctionScope, or ModuleScope
 */
function createScopeSpace(root) {
  const scanned = new Set;
  const found = new Map;

  const from = (path) => createScopeFromPath(path, root, found);
  const scan = (path) => {
      const result = from(path);
      if (scanned.has(result.path.node)) {
        return result;
      }
      const ret = scanScope(path, root, found);
      scanned.add(ret.path.node);
      return ret;
  }
  return {
    scan,
    from
  }
}

/**
 Gets the scope for a path, then walks its children. Will stop once it encounters a scope that cannot leak into this scope (nested Functions for
 example).
 */
function scanScope(startPath, root, memoCache) {
  const result = createScopeFromPath(startPath, root, memoCache);
  const scope = result.scope;
  const stopOn = [];
  function shouldStop(path) {
    if (path.node === result.path.node) return false;
    return stopOn.some(t => t.introducedByPath(path));
  }
  if (scope instanceof GlobalScope ||
    scope instanceof ModuleScope ||
    scope instanceof FunctionScope
  ) {
    stopOn.push(FunctionScope);
  }
  else if (scope instanceof BlockScope ||
    scope instanceof CatchScope) {
    stopOn.push(BlockScope, CatchScope);
  }
  else {
    throw Error(`Unknown Scope type for ${scope}`);
  }
  const visitors = Object.keys(SCANNERS).reduce((acc, key) => {
    const handler = SCANNERS[key];
    acc[key] = function (path) {
      if (shouldStop(path)) {
        return false;
      }
      this.traverse(path);
      if (handler !== null) {
        const currentScope = createScopeFromPath(path, root, memoCache);
        handler(path, currentScope.scope);
      }
    }
    return acc;
  }, Object.create(null));
  visit(result.path.node, visitors);
  return result;
}

/**
 Scripts should set root to be a GlobalScope
 ES Modules should set root to be a ModuleScope
 CJS/AMD Modules should set root to be a FunctionScope
 `root` could have parent scope setup to a shared GlobalScope

 Generates a new Scope for the closest parent of `path`. If a Program is
 found the `root` is returned instead since different source wrappers (AMD,
 Browser, CJS, ES Modules, etc.) have differing scoping rules at top level.

 Use the cache to memoize

 @param {NodePath} path
 @param {Scope|void} root
 @param {}
 @param {Map<AST, Scope>} cache
 */
function createScopeFromPath(path, root, cache) {
  while (path) {
    if (cache.has(path.node)) {
      return cache.get(path.node);
    }
    if (n.Program.check(path.node)) {
      const ret = {
        path,
        scope: root
      };
      cache.set(path.node, ret);
      return ret;
    }
    const scopeType = [
      FunctionScope,
      BlockScope,
      CatchScope
    ].find(type => type.introducedByPath(path));
    if (scopeType) {
      let memod = false;
      let memo;
      const scope = new scopeType(
        () => {
          if (memod) return memo;
          memod = true;
          return memo = createScopeFromPath(path.parent, root, cache);
        }
      );
      const ret = {
        path,
        scope
      };
      cache.set(path.node, ret);
      return ret;
    }
    path = path.parent;
  }
  throw Error(`No scope found, no Program in AST?`);
}

function addPattern(path, onBind) {
  const node = path.node;
    if (n.Identifier.check(node)) {
      onBind(node.name, path);
    } else if (n.ObjectPattern.check(node)) {
      path.get('properties').each(propertyPath => {
        const property = propertyPath.value;
        if (n.Pattern.check(property)) {
          addPattern(propertyPath, onBind);
        } else if (n.Property.check(property)) {
          addPattern(propertyPath.get('value'), onBind);
        } else if (n.SpreadProperty.check(property)) {
          addPattern(propertyPath.get('argument'), onBind);
        }
      });
    } else if (n.ArrayPattern.check(node)) {
      path.get('elements').each(elementPath => {
        const element = elementPath.value;
        if (n.Pattern.check(element)) {
          addPattern(elementPath, onBind);
        } else if (n.SpreadElement.check(element)) {
          addPattern(elementPath.get("argument"), onBind);
        }
      });
    } else if (n.PropertyPattern.check(node)) {
      addPattern(path.get('pattern'), onBind);
    } else if (n.SpreadElementPattern.check(node) ||
               n.SpreadPropertyPattern.check(node)) {
      addPattern(path.get('argument'), onBind);
    } else if (n.RestElement.check(node)) {
      addPattern(path.get("argument"), onBind);
    }
    else {
      throw Error(`Unknown pattern type ${path.value}`);
    }
}


const ast_a = require('esprima').parse(`var a;`);
const ast_b = require('esprima').parse(`var b;`);
const ast_c = require('esprima').parse(`var c;`);
const realm = new GlobalScope;
const space = createScopeSpace(realm);
visit(ast_a, {
  visitProgram(path) {
    space.scan(path);
    return false;
  }
});
visit(ast_b, {
  visitProgram(path) {
    space.scan(path);
    return false;
  } 
});
// DON'T SCAN C
visit(ast_c, {
  visitProgram(path) {
    // space.scan(path);
    return false;
  } 
});
console.log(realm);