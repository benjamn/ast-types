/* global require, exports */

function ASTLib(defs) {
    this.builtInTypes = {};
    
    // In order to return the same Def instance every time Type.def is called
    // with a particular name, those instances need to be stored in a cache.
    this.defCache = Object.create(null);
    this.builders = {};
    
    // This object is used as prototype for any node created by a builder.
    this.nodePrototype = {};
    this.namedTypes = {};
    
    this._registeredDefs = {};
    this._required = {};
    this._requiring = {};
    
    this.require('./types');
    this.require('./shared');
    this.registerDefs('../def/core');
    if (!!defs) {
        this.registerDefs(defs);
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

AP.registerDefs = function(defs) {
    if (!Array.isArray(defs)) {
        defs = [defs];
    }
    defs
        .map(require.resolve)
        .forEach(function(path) {
            if (this._registeredDefs[path]) {
                return;
            }
            var def = require(path);
            def.init(this);
            this._registeredDefs[path] = true;
        }, this);
};
