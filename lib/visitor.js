// Abstract implementation of the visitor pattern

var assert = require("assert");
var types = require("./types");
var StackPath = require("./stack-path");
var isObject = types.builtInTypes.object;
var isFunction = types.builtInTypes.function;
var hasOwn = Object.prototype.hasOwnProperty;

var hasFunctionToString = /body/.test(function () { body }.toString());


function Visitor () {
    assert.ok(this instanceof Visitor);

    var lookup = this.methodLookupTable = Object.create(null);

    // Collect visit methods (also from prototypes)
    for (var prop in this) {
        if (/^visit[A-Z]/.test(prop)) {
            lookup[prop.slice("visit".length)] = true;
        }
    }

    // Get the mapping between specific to super types
    var mapping = types.computeSupertypeLookupTable(lookup);

    Object.keys(mapping).forEach(function (type) {
        var name = 'visit' + mapping[type];
        if (isFunction.check(this[name])) {
            lookup[type] = this[name];
        }
    }, this);

    // Get our own version of the traversal
    var fn = traversal;
    if (hasFunctionToString) {
        fn = compile(traversal.toString(), Object.keys(lookup));
    }
    this.traversal = fn;
}

var Vp = Visitor.prototype = Object.create(null);
Vp.constructor = Visitor;


// Create a new visitor to traverse some node
Visitor.visit = function (node, methods) {
    var visitor = Visitor.fromMethodsObject(methods);
    return visitor.visit(node);
};

// Helper to obtain a hopefully unique hash from a set of methods
function getMethodsHash (methods) {
  if (!hasFunctionToString) {
    return null;
  }

  var value, hash = '';
  for (var key in methods) if (hasOwn.call(methods, key)) {
    value = methods[key];
    hash += key + ':' + (value && value.toString());
  }

  return hash;
}

// Create an ad-hoc visitor for the given methods
var cachedMethods = {};
Visitor.fromMethodsObject = function (methods) {
    if (methods instanceof Visitor) {
        return methods;
    }

    if (!isObject.check(methods)) {
        // An empty visitor?
        return new Visitor;
    }

    var hash = getMethodsHash(methods);
    if (hash && hasOwn.call(cachedMethods, hash)) {
        return cachedMethods[hash];
    }

    function AdHoc () {
        Visitor.apply(this, arguments);
    }
    AdHoc.prototype = Object.create(Visitor.prototype);
    AdHoc.prototype.constructor = AdHoc;

    for (var property in methods) {
      if (hasOwn.call(methods, property)) {
        AdHoc.prototype[property] = methods[property];
      }
    }

    var instance = new AdHoc;

    if (hash) {
        cachedMethods[hash] = instance;
    }

    return instance;
};

var ContextConstructor = function () {};

Vp.visit = function(value) {
    // Every call to visit creates a new object sharing the visitor prototype,
    // this allows the visitor to store state without corrupting the original.
    // Note: Avoids using Object.create since it kinda slow-ish
    ContextConstructor.prototype = this;
    var context = new ContextConstructor;
    context.visitor = this.visitor || this;

    // Always start with a rooted stack
    context.stack = [];
    context.traverseCount = 0;

    // The default path property is always in sync with the visitor traversal
    context.path = new StackPath();
    context.path.stack = context.stack;

    // Allow visitor to initialize themselves
    context.reset(value);

    context.traversal(context.stack, null, value);

    return context;
};

Vp.reset = function reset() {
    // Empty stub; may be reassigned or overridden by subclasses.
};


// Dispatch the node with a custom function
// Should return true if we want to traverse it after returning
Vp.dispatch = function dispatch(node) {
    var fn = this.methodLookupTable[node.type];
    if (!fn) return true;

    this.needToCallTraverse = true;

    var path = null;
    if (fn.length !== 1) {
      // TODO: Does it make sense to automatically clone it?
        path = this.path.clone();
    }

    var result = fn.call(this, node, path);
    if (typeof result === 'object') {
        // Any value returned from the visitor method
        // is interpreted as a replacement value.
        this.path.replace(result);
    }

    return result !== false && this.needToCallTraverse;
};

Vp.traverse = function (fieldName, visitor) {
    if (typeof fieldName !== 'string') {
        visitor = fieldName;
        fieldName = undefined;
    }

    visitor = visitor
            ? Visitor.fromMethodsObject(visitor)
            : this;

    visitor.traversal(this.stack, fieldName);
};


// Main traversal algorithm, it should be pretty fast by default since it
// avoids recursion and allocations, note however that it's designed as a
// "template" for meta programming. The visitor constructor will analyze the
// types system and, if the environment suports it, generate a new version of
// this function with optimized code paths.
function traversal (stack, key, val) {

    // Guard value to identify when to pop the stack
    var POP = {};
    // List of pending (key,value) to traverse
    var queue = [];
    // Position of the next item to dequeue, avoids the expensive .shift()
    var qptr = 0;
    // Cache for types.getFieldNames
    var cached = {};

    var result, i, l;

    // Uses types reflection to queue the fields of a node
    var reflection = function (node) {
        var names = cached[node.type] || (cached[node.type] = types.getFieldNames(node));
        var name, i, l;

        for (i = 0, l = names.length; i < l; ++i) {
          name = names[i];
          if (!node[name]) {
            node[name] = types.getFieldValue(node, name);
          }

          if (typeof node[name] === 'object') {
              queue.push(name, node[name], POP);
          }
        }
    };

    // Two ways the traversal can be initialized. Either we obtain a key:val
    // which should be visited (i.e.: root Program node) or we don't get them
    // in which case the latest value from the stack is traversed via reflection
    // but not visited.
    if (key === undefined) {
        val = stack[ stack.length - 1 ];
        if (Array.isArray(val)) {
            for (i = 0, l = val.length; i < l; i++) {
                queue.push(i, val[i], POP);
            }
        } else if (val) {
            reflection(val);
        }
    } else {
        if (val === undefined) {
            val = stack[ stack.length - 1 ][key];
        }
        queue.push(key, val, POP);
    }

    // Note about the queuing mechanism, to avoid the expensive call to shift()
    // it won't ever remove queued items from the list, instead it just moves
    // a pointer to the next element to be dequeued. This allows for both push
    // and shift to be O(1) operations and just after the traversal the queue
    // will be out of scope so the GC will do its job.

    while (queue.length > qptr) {

        // We're traversing so lets reset the flag
        this.needToCallTraverse = false;

        // Dequeue the next key and increase the queue pointer
        key = queue[qptr++];

        // When this guard is detected let's use it to backtrack in the stack
        if (key === POP) {
            stack.pop();
            stack.pop();
            continue;
        }

        // Dequeue the value and increase the queue pointer
        val = queue[qptr++];

        // Keep the stack current with the value about to be analized
        stack.push(key, val);

        if (!val) continue;

        if (Array.isArray(val)) {
            // This could probably be optimized by using .push.apply and
            // some clever handling when dequeuing the key, although it's
            // not clear if it'll provide a real benefit.
            for (i = 0, l = val.length; i < l; i++) {
                queue.push(i, val[i], POP);
            }
            continue;
        }

        // DO NOT REMOVE THIS!
        // We'll inject here a switch statement with optimized traversal code
        // using meta programming instead of relying always on type reflection.
        'COMPILATION_PLACEHOLDER';

        // Let the visitor handle the dispatching of nodes
        result = this.dispatch(val);
        if (!result) {
            continue;
        }

        // If we reached this point means that we have a node and we need to
        // use reflection to know how to traverse it.
        reflection(val);
    }

}


function getTraversableFields (def) {

    return Object.keys(def.allFields).filter(function (fname) {
        if (fname === 'type') return false;

        var ftype = def.allFields[fname].type;

        // TODO: This is very dirty, we rely on string manipulation of the type
        //       name to guess what it's made of.
        var str = typeof ftype.name === 'function' ? ftype.name() : ftype.name;
        var names = str.replace(/\[|\]/g, '').split(/\s*\|\s*/);
        return names.some(function (name) {
            if (!types.namedTypes[name]) return false;
            return !!types.Type.def(name).allSupertypes['Node'];
        });
    });
}

function compile (tpl, methodTypes) {

    var typefields = {};

    // This is the list of most frequent node types on (jQuery)
    // Adding too many optimized node types can result in a degraded performance.
    named = [
      'Identifier',
      'Literal',
      'MemberExpression',
      'CallExpression',
      'BlockStatement',
      'ExpressionStatement',
      'AssignmentExpression',
      'BinaryExpression',
      'FunctionExpression',
      'IfStatement',
      'LogicalExpression',
      'VariableDeclarator',
      'ReturnStatement',
      'Property',
      'ThisExpression'
    ];

    named.forEach(function (name) {

        var def = types.Type.def(name);
        if (def.buildable) {
            typefields[name] = getTraversableFields(def);
        }

    });

    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#4-switch-case
    // Up to 128 case clauses are optimizable by v8
    // Own tests show that on Node 0.10 when having more than 30 cases it
    // starts degrading. Perhaps it's dependant on the total amount of code
    // and not the number of cases?
    var cases = Object.keys(typefields).map(function (tname) {
        var hasMethod = methodTypes.indexOf(tname) !== -1;
        var code = [
            'case "' + tname + '":'
        ];


        if (hasMethod) {
          code.push(
            '    result = this.dispatch(val);',
            '    if (result) {'
          );
        }

        typefields[tname].forEach(function (field) {
          code.push(
            '        val.' + field + ' && queue.push("' + field + '", val.' + field + ', POP);'
          );
        });

        if (hasMethod) {
          code.push(
            '    }'
          );
        }

        code.push(
            '    continue;'
        );

        return code.join('\n');
    });

    var code = [
      'switch (val.type) {',
      cases.join('\n'),
      '}'
    ].join('\n');


    code = tpl.replace(/'COMPILATION_PLACEHOLDER';/, code);

    // Inject closure deps using arguments in the outer function
    var compiler = new Function('types', 'return ' + code);
    return compiler(types);
}



module.exports = Visitor;
