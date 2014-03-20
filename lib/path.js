var assert = require("assert");
var Op = Object.prototype;
var hasOwn = Op.hasOwnProperty;
var toString = Op.toString;
var arrayToString = toString.call([]);
var Ap = Array.prototype;
var slice = Ap.slice;
var map = Ap.map;

function Path(value, parentPath, name) {
    assert.ok(this instanceof Path);

    if (parentPath) {
        assert.ok(parentPath instanceof Path);
    } else {
        parentPath = null;
        name = null;
    }

    // The value encapsulated by this Path, generally equal to
    // parentPath.value[name] if we have a parentPath.
    this.value = value;

    // The immediate parent Path of this Path.
    this.parentPath = parentPath;

    // The name of the property of parentPath.value through which this
    // Path's value was reached.
    this.name = name;

    // Calling path.get("child") multiple times always returns the same
    // child Path object, for both performance and consistency reasons.
    this.__childCache = {};
}

var Pp = Path.prototype;

function getChildPath(path, name) {
    var cache = path.__childCache;
    return hasOwn.call(cache, name)
        ? cache[name]
        : cache[name] = new path.constructor(
            path.getValueProperty(name), path, name);
}

// This method is designed to be overridden by subclasses that need to
// handle missing properties, etc.
Pp.getValueProperty = function(name) {
    return this.value[name];
};

Pp.get = function(name) {
    var path = this;
    var names = arguments;
    var count = names.length;

    for (var i = 0; i < count; ++i) {
        path = getChildPath(path, names[i]);
    }

    return path;
};

Pp.each = function(callback, context) {
    var childPaths = [];
    var len = this.value.length;
    var i = 0;

    // Collect all the original child paths before invoking the callback.
    for (var i = 0; i < len; ++i) {
        if (hasOwn.call(this.value, i)) {
            childPaths[i] = this.get(i);
        }
    }

    // Invoke the callback on just the original child paths, regardless of
    // any modifications made to the array by the callback. I chose these
    // semantics over cleverly invoking the callback on new elements because
    // this way is much easier to reason about.
    context = context || this;
    for (i = 0; i < len; ++i) {
        if (hasOwn.call(childPaths, i)) {
            callback.call(context, childPaths[i]);
        }
    }
};

Pp.map = function(callback, context) {
    var result = [];

    this.each(function(childPath) {
        result.push(callback.call(this, childPath));
    }, context);

    return result;
};

Pp.filter = function(callback, context) {
    var result = [];

    this.each(function(childPath) {
        if (callback.call(this, childPath)) {
            result.push(childPath);
        }
    }, context);

    return result;
};

Pp.replace = function(replacement) {
    var count = arguments.length;

    assert.ok(
        this.parentPath instanceof Path,
        "Instead of replacing the root of the tree, create a new tree."
    );

    var name = this.name;
    var parentValue = this.parentPath.value;
    var parentCache = this.parentPath.__childCache;
    var results = [];

    if (toString.call(parentValue) === arrayToString) {
        delete parentCache.length;
        delete parentCache[name];

        var moved = {};

        for (var i = name + 1; i < parentValue.length; ++i) {
            var child = parentCache[i];
            if (child) {
                var newIndex = i - 1 + count;
                moved[newIndex] = child;
                Object.defineProperty(child, "name", { value: newIndex });
                delete parentCache[i];
            }
        }

        var args = slice.call(arguments);
        args.unshift(name, 1);
        parentValue.splice.apply(parentValue, args);

        for (newIndex in moved) {
            if (hasOwn.call(moved, newIndex)) {
                parentCache[newIndex] = moved[newIndex];
            }
        }

        for (i = name; i < name + count; ++i) {
            results.push(this.parentPath.get(i));
        }

    } else if (count === 1) {
        delete parentCache[name];
        parentValue[name] = replacement;
        results.push(this.parentPath.get(name));

    } else if (count === 0) {
        delete parentCache[name];
        delete parentValue[name];

    } else {
        assert.ok(false, "Could not replace Path.");
    }

    return results;
};

module.exports = Path;
