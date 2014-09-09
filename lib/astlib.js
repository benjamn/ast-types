/* global require, exports */

function ASTLib(defs, name) {
    this.name = name;
    
    this._required = {};
    this._requiring = {};
    this.builtInTypes = {};
    // In order to return the same Def instance every time Type.def is called
    // with a particular name, those instances need to be stored in a cache.
    this.defCache = Object.create(null);
    
    this.builders = {};
    
    // This object is used as prototype for any node created by a builder.
    this.nodePrototype = {};
    
    this.namedTypes = {};
    
    this.require('./types');
    this.require('./shared');
    this.registerDefs(require('../def/core'));
    if (!!defs) {
        this.registerDefs(defs, true);
    }
    this.finalize();
    this.require('./equiv');
    this.require('./path');
    this.require('./scope');
    this.require('./node-path');
    this.require('./path-visitor');
    this.require('./traverse');
}
exports.ASTLib = ASTLib;

var AP = ASTLib.prototype;

AP.require = function(path) {
    path = require.resolve(path);
    if (!this._required[path]) {
        if (this._requiring[path]) {
            throw new Error("Circular deps with " + path);
        }
        this._requiring[path] = true;
        this._required[path] = require(path).init(this) || true;
        this._requiring[path] = false;
    }
    return this._required[path];
};

AP.registerDefs = function(defs, finalize) {
    if (!Array.isArray(defs)) {
        defs = [defs];
    }
    defs
        .forEach(function(def) {
            def.init(this);
        }, this);
    if (finalize) {
        this.finalize();
    }
};

/*
To deal with javascript's odd binding, we need to ensure that the "types" variable
in various functions refers to the correct one, this method curries the parameter
and passes the current "types" as the first parameter.

*/
AP.curry = function(fn) {
    return (function(types) { 
        return function() {
            return fn.apply(this, [types].concat(Array.prototype.slice.call(arguments, 0)));
        };
    })(this);
};