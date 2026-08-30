# Changelog

Notable changes to `ast-types`, newest first. Entries under **Unreleased**
describe what is on `master` but not yet published to npm.

## Unreleased

### Syntax support

- `CallExpression`, `NewExpression` and `OptionalCallExpression` now carry
  `typeParameters` (TypeScript type arguments such as `f<T>()`), and the
  visitor traverses them. Contributed by Lenz Weber-Tronic in #954; fixes
  #343 and facebook/jscodeshift#389.
- Support `export type * from "mod"` and `export type * as ns from "mod"`
  (TypeScript 5.0). `ExportAllDeclaration` and `ExportNamedDeclaration`
  gain an `exportKind` field (`"value" | "type"`, default `"value"`),
  mirroring `ImportDeclaration.importKind`.
- `ExportNamedDeclaration.specifiers` now accepts `ExportNamespaceSpecifier`,
  `ExportDefaultSpecifier` and `ExportBatchSpecifier`, matching Babel's
  representation of `export * as ns from "mod"`.
- `ExportNamespaceSpecifier.exported` may be a string `Literal`, per ES2022
  arbitrary module namespace names (`export * as "ns" from "mod"`).
- `ExportNamedDeclaration.declaration` now defaults to `null`, so Babel
  ASTs that omit the property for specifier-only exports validate.

### Type changes to be aware of

Runtime behavior and builder signatures are unchanged; the changes above
only widen what is accepted. Two generated TypeScript types are wider than
before, which can affect downstream code that narrowed on the old type:

- Code that reads `specifier.local` on every element of
  `ExportNamedDeclaration.specifiers` needs a
  `namedTypes.ExportSpecifier.check(specifier)` guard.
- Code that reads `exported.name` on an `ExportNamespaceSpecifier` needs to
  check for `Identifier` first.

### Testing and infrastructure

- Bump `@babel/parser` (dev dependency) from 7.20.5 to 7.29.8, which also
  updates the Babel fixture corpus the tests validate against.
- Honor `sourceType` from Babel fixture `options.json` files, and fix a
  null dereference when comparing expected parse errors.
- Update test-only dependencies: `glob` 10, `rimraf` 5, `mocha` 11,
  `ts-node`, `@types/mocha`, `@types/esprima`. Enable `skipLibCheck` so
  `tsc` no longer type-checks `node_modules` declarations.
- Modernize the GitHub Actions workflow: Node.js 18, 20, 22 and 24,
  `npm ci`, and a check that `src/gen/` is up to date with `src/def/`.

## v0.16.1 and earlier

See the `v*` git tags and the commit history between them.
