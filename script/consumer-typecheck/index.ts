// A minimal consumer of the published package surface (lib/main), compiled
// by script/run-tests.sh with both the pinned TypeScript and a current
// TypeScript 5.x under --isolatedModules. This catches declaration-file
// problems that only show up in downstream projects, such as an import
// that conflicts with a local value (TS2865, TypeScript >= 5.4; see #948).

import {
  builders as b,
  namedTypes as n,
  NodePath,
  Type,
  builders,
  visit,
} from "../../lib/main";

const id = b.identifier("x");
n.Identifier.assert(id);

// These names must work both as values and as (generic) types.
const path: NodePath<n.Identifier> = new NodePath(id);
const type: Type<n.Identifier> = n.Identifier;
const bs: builders = b;

visit(id, {
  visitIdentifier(p) {
    void p.node.name;
    return false;
  },
});

export { path, type, bs };
