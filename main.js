var types = require("./lib/types");

// This core module of AST types captures ES5 as it is parsed today by
// git://github.com/ariya/esprima.git#master.
require("./lib/core");

// Feel free to add to or remove from this list of extension modules to
// configure the precise type hierarchy that you need.
require("./lib/es6");
require("./lib/mozilla");
require("./lib/recast");
require("./lib/e4x");
require("./lib/xjs");

exports.builtInTypes = types.builtInTypes;
exports.namedTypes = types.namedTypes;
exports.builders = types.builders;
