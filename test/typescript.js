"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var glob_1 = __importDefault(require("glob"));
var parser_1 = require("@babel/parser");
var fork_1 = __importDefault(require("../fork"));
var typescript_1 = __importDefault(require("../def/typescript"));
var jsx_1 = __importDefault(require("../def/jsx"));
var pkgRootDir = path_1.default.resolve(__dirname, "..");
var tsTypes = fork_1.default([
    typescript_1.default,
    jsx_1.default,
]);
var babelParserDir = path_1.default.resolve(__dirname, "data", "babel-parser");
var babelTSFixturesDir = path_1.default.join(babelParserDir, "test", "fixtures", "typescript");
glob_1.default("**/input.js", {
    cwd: babelTSFixturesDir,
}, function (error, files) {
    if (error) {
        throw error;
    }
    describe("Whole-program validation for Babel TypeScript tests", function () {
        if (error) {
            throw error;
        }
        files.forEach(function (tsPath) {
            var fullPath = path_1.default.join(babelTSFixturesDir, tsPath);
            // Until https://github.com/babel/babel/pull/7967 is released:
            var shouldSkip = tsPath.endsWith("conditional-infer/input.js");
            (shouldSkip ? xit : it)("should validate " + path_1.default.relative(pkgRootDir, fullPath), function (done) {
                fs_1.default.readFile(fullPath, "utf8", function (error, code) {
                    if (error) {
                        throw error;
                    }
                    var program = tryParse(code, fullPath);
                    if (program !== null) {
                        tsTypes.namedTypes.Program.assert(program, true);
                    }
                    done();
                });
            });
        });
    });
    function tryParse(code, fullPath) {
        var parseOptions = getOptions(fullPath);
        try {
            return parser_1.parse(code, parseOptions).program;
        }
        catch (error) {
            // If parsing fails, check options.json to see if the failure was
            // expected.
            try {
                var options = JSON.parse(fs_1.default.readFileSync(path_1.default.join(path_1.default.dirname(fullPath), "options.json")).toString());
            }
            catch (optionsError) {
                console.error(optionsError.message);
            }
            if (options &&
                options.throws === error.message) {
                return null;
            }
            throw error;
        }
    }
    function getOptions(fullPath) {
        var plugins = getPlugins(path_1.default.dirname(fullPath));
        return {
            sourceType: "module",
            plugins: plugins,
        };
    }
    function getPlugins(dir) {
        try {
            var options = JSON.parse(fs_1.default.readFileSync(path_1.default.join(dir, "options.json")).toString());
        }
        catch (ignored) {
            options = {};
        }
        if (options.plugins) {
            return options.plugins;
        }
        if (dir !== babelTSFixturesDir) {
            return getPlugins(path_1.default.dirname(dir));
        }
        return [
            "typescript",
        ];
    }
});
var tsCompilerDir = path_1.default.resolve(__dirname, "data", "typescript-compiler");
glob_1.default("**/*.ts", {
    cwd: tsCompilerDir,
}, function (error, files) {
    if (error) {
        throw error;
    }
    describe("Whole-program validation for TypeScript codebase", function () {
        if (error) {
            throw error;
        }
        this.timeout(20000);
        files.forEach(function (tsPath) {
            var fullPath = path_1.default.join(tsCompilerDir, tsPath);
            it("should validate " + path_1.default.relative(pkgRootDir, fullPath), function (done) {
                fs_1.default.readFile(fullPath, "utf8", function (error, code) {
                    if (error) {
                        throw error;
                    }
                    var program = parser_1.parse(code, {
                        sourceType: "module",
                        plugins: [
                            "typescript",
                            "objectRestSpread",
                            "classProperties",
                            "optionalCatchBinding",
                        ]
                    }).program;
                    tsTypes.namedTypes.Program.assert(program, true);
                    done();
                });
            });
        });
    });
});
