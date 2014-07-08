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
    this.__childCache = Object.create(null);
}

var Pp = Path.prototype;

function getChildPath(path, name) {
    var cache = path.__childCache;
    var actualChildValue = path.getValueProperty(name);
    var childPath = cache[name];
    if (!hasOwn.call(cache, name) ||
        // Ensure consistency between cache and reality.
        childPath.value !== actualChildValue) {
        childPath = cache[name] = new path.constructor(
            actualChildValue, path, name
        );
    }
    return childPath;
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
    var results = [];
    var parentValue = this.parentPath.value;
    var parentCache = this.parentPath.__childCache;
    var count = arguments.length;

    if (toString.call(parentValue) === arrayToString) {
        var originalLength = parentValue.length;
        var moved = Object.create(null);

        if (parentValue[this.name] !== this.value) {
            // Something caused our index (name) to become out of date.
            var i = parentValue.indexOf(this.value);
            if (i >= 0) {
                parentCache[this.name = i] = this;
            }
        }

        assert.strictEqual(parentValue[this.name], this.value);
        assert.strictEqual(this.parentPath.get(this.name), this);

        for (var i = this.name + 1; i < originalLength; ++i) {
            if (hasOwn.call(parentCache, i)) {
                var childPath = parentCache[i];
                var newIndex = i - 1 + count;
                moved[newIndex] = childPath;
                childPath.name = newIndex;
                delete parentCache[i];
            }
        }

        delete parentCache.length;

        var spliceArgs = [this.name, 1];
        for (i = 0; i < count; ++i) {
            spliceArgs.push(arguments[i]);
        }

        var splicedOut = parentValue.splice.apply(parentValue, spliceArgs);

        assert.strictEqual(splicedOut[0], this.value);
        assert.strictEqual(
            parentValue.length,
            originalLength - 1 + count
        );

        for (newIndex in moved) {
            parentCache[newIndex] = moved[newIndex];
        }

        if (count === 0) {
            delete this.value;
            delete parentCache[this.name];
            this.__childCache = {};

        } else {
            assert.strictEqual(parentValue[this.name], replacement);

            if (this.value !== replacement) {
                this.value = replacement;
                this.__childCache = {};
            }

            for (i = 0; i < count; ++i) {
                results.push(this.parentPath.get(this.name + i));
            }

            assert.strictEqual(results[0], this);
        }

    } else if (count === 1) {
        if (this.value !== replacement) {
            this.__childCache = {};
        }
        this.value = parentValue[this.name] = replacement;
        results.push(this);

    } else if (count === 0) {
        delete parentValue[this.name];
        delete this.value;
        this.__childCache = {};

        // Leave this path cached as parentCache[this.name], even though
        // it no longer has a value defined.

    } else {
        assert.ok(false, "Could not replace path");
    }

    return results;
};

module.exports = Path;
