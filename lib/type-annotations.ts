import { Fork } from "../types";
import buildersPlugin from "./builders";
import namedTypesPlugin from "./named-types";
import { TypeUnion } from "./types";
import { assertNever } from "./utils";

const Op = Object.prototype;
const hasOwn = Op.hasOwnProperty;

export default function typeAnnotationsPlugin(fork: Fork) {
  const { builders } = fork.use(buildersPlugin);
  const { namedTypes } = fork.use(namedTypesPlugin);

  function getTSTypeAnnotation(type: TypeUnion<any>): any {
    switch(type.kind) {
      case "ArrayType": {
        let elemTypeAnnotation = type.elemType.getTSTypeAnnotation();
        if (namedTypes.TSUnionType.check(elemTypeAnnotation)) { // TODO Improve this test.
          elemTypeAnnotation = builders.tsParenthesizedType(elemTypeAnnotation);
        }
        return builders.tsArrayType(elemTypeAnnotation);
      }

      case "IdentityType": {
        if (type.value === null) {
          return builders.tsNullKeyword();
        }
        switch (typeof type.value) {
          case "undefined": return builders.tsUndefinedKeyword();
          case "string":    return builders.tsLiteralType(builders.stringLiteral(type.value));
          case "boolean":   return builders.tsLiteralType(builders.booleanLiteral(type.value));
          case "number":    return builders.tsNumberKeyword();
          case "object":    return builders.tsObjectKeyword();
          case "function":  return builders.tsFunctionType();
          case "symbol":    return builders.tsSymbolKeyword();
          default:          return builders.tsAnyKeyword();
        }
      }

      case "ObjectType": {
        return builders.tsTypeLiteral.from({
          members: type.fields.map(field => field.getPropertySignature(builders))
        });
      }

      case "OrType": {
        return builders.tsUnionType(
          type.types.map(type => type.getTSTypeAnnotation())
        );
      }

      case "PredicateType": {
        if (typeof type.name !== "string") {
          return builders.tsAnyKeyword();
        }

        if (hasOwn.call(namedTypes, type.name)) {
          // TODO Make this work even if TypeScript types not used?
          return builders.tsTypeReference(builders.tsQualifiedName(
            builders.identifier("K"), // TODO Don't hard-code this.
            builders.identifier(type.name + "Kind")
          ));
        }

        if (/^[$A-Z_][a-z0-9_$]*$/i.test(type.name)) {
          return builders.tsTypeReference(builders.identifier(type.name));
        }

        if (/^number [<>=]+ \d+$/.test(type.name)) {
          return builders.tsNumberKeyword();
        }

        // Not much else to do...
        return builders.tsAnyKeyword();
      }

      default:
        return assertNever(type);
    }
  }

  return {
    getTSTypeAnnotation,
  };
}
