/* global exports, require */
var astlib = require("./lib/astlib");

exports.init = function(defs, name) {
    return new astlib.ASTLib(defs, name);
};

exports.ESLang = ["./def/escore", "./def/e4x", "./def/es6", "./def/es7",
                  "./def/fb-harmony", "./def/mozilla"].map(require);