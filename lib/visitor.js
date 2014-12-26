// Abstract implementation of the visitor pattern

var assert = require("assert");
var types = require("./types");
var isObject = types.builtInTypes.object;
var isFunction = types.builtInTypes.function;
var hasOwn = Object.prototype.hasOwnProperty;


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
    var fn = traversal, tpl = traversal.toString();
    if (tpl.indexOf('COMPILATION_PLACEHOLDER')) {
      fn = compile(tpl, Object.keys(lookup));
    }
    this.traversal = fn.bind(this, types, this);
}

var Vp = Visitor.prototype = Object.create(null);
Vp.constructor = Visitor;

// Create customized visitors
Visitor.create = function create(init) {
    function CreatedVisitor () {
        Visitor.call(this);
        init && init.apply(this, arguments);
    }

    CreatedVisitor.prototype = Object.create(Vp);
    CreatedVisitor.prototype.constructor = CreatedVisitor;

    CreatedVisitor.fromMethodsObject = fromMethodsObject.bind(null, CreatedVisitor);
    CreatedVisitor.visit = function (value, methods) {
        var visitor = CreatedVisitor.fromMethodsObject(methods);
        return visitor.visit(value);
    };

    return CreatedVisitor;
};

// Create an ad-hoc visitor for the given methods
function fromMethodsObject (ctor, methods) {
    if (methods instanceof Visitor) {
        return methods;
    }

    if (!isObject.check(methods)) {
        // An empty visitor?
        return new ctor;
    }

    function AdHoc () {
        ctor.apply(this, arguments);
    }
    AdHoc.prototype = Object.create(ctor.prototype);
    AdHoc.prototype.constructor = ctor;

    for (var property in methods) {
      if (hasOwn.call(methods, property)) {
        AdHoc.prototype[property] = methods[property];
      }
    }

    return new AdHoc;
};

var recursiveVisitWarning = [
    "Recursively calling .visit(node) resets visitor state.",
    "Try this.traverse(node) instead."
].join(" ");


Vp.visit = function(value) {
    assert.ok(!this._visiting, recursiveVisitWarning);

    // Every call to visit creates a new object sharing the visitor prototype,
    // this allows the visitor to store state without corrupting the original.
    var context = Object.create(this);
    context.visitor = this;

    // Private state that needs to be reset before every traversal.
    context._visiting = true;
    // Always start with a rooted stack
    context.stack = [null, value];

    // Allow visitor to initialize themselves
    context.reset(value);

    context.traverse();

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
        // path = this.path.clone();
    }

    var result = fn.call(this, node, path);
    if (typeof result === 'object') {
        // Any value returned from the visitor method
        // is interpreted as a replacement value.
        // this.path.replace(result);
    }

    if (this.needToCallTraverse) {
        result = true;
    }

    return result !== false;

};

Vp.traverse = function (visitor) {
    visitor = visitor
            ? this.constructor.fromMethodsObject(visitor)
            : this;

    visitor.needToCallTraverse = false;
    visitor.traversal(this.stack);
};


// Main traversal algorithm, it should be pretty fast by default since it
// avoids recursion and allocations, note however that it's designed as a
// "template" for meta programming. The visitor constructor will analyze the
// types system and, if the environment suports it, generate a new version of
// this function with optimized code paths.
// Since it's designed to be dynamically compilled it can't use anything from
// the closure, it must be self contained. That's why it receives all the deps
// as arguments.
function traversal (types, visitor, stack) {

    // Guard value to identify when to pop the stack
    var POP = {};
    // List of pending (key,value) to traverse
    var queue = [];
    // Position of the next item to dequeue, avoids the expensive .shift()
    var qptr = 0;
    // Cache for types.getFieldNames
    var cached = {};

    var key, val, result, i, l;

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

    // Initialize the loop by using reflection on the last value from the
    // stack, trying to use the optimized code path for the first iteration
    // looks awkward and the performance difference should be negligible.
    val = stack[stack.length - 1];
    if (Array.isArray(val)) {
        for (i = 0, l = val.length; i < l; i++) {
            queue.push(i, val[i], POP);
        }
    } else {
        reflection(val);
    }

    // Note about the queuing mechanism, to avoid the expensive call to shift()
    // it won't ever remove queued items from the list, instead it just moves
    // a pointer to the next element to be dequeued. This allows for both push
    // and shift to be O(1) operations and just after the traversal the queue
    // will be out of scope so the GC will do its job.

    while (queue.length > qptr) {

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
        if (!val) continue;

        // Keep the stack current with the value about to be analized
        stack.push(key, val);

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
        result = visitor.dispatch(val);
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
            '    result = visitor.dispatch(val);',
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

    var compiler = new Function('', 'return ' + code);
    return compiler();
}



module.exports = Visitor;
