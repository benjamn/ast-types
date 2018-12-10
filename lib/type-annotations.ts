import { Fork } from "../types";
import typesPlugin, { Field, Type } from "./types";
import { assertNever } from "./utils";

const Op = Object.prototype;
const hasOwn = Op.hasOwnProperty;

export interface TSTypeAnnotatorConfig {
  getReferenceToKind(typeName: string): any;
}

export default function typeAnnotationsPlugin(fork: Fork) {
  const { builders, namedTypes } = fork.use(typesPlugin);

  function createTSTypeAnnotator(config: TSTypeAnnotatorConfig) {
    function getTSTypeAnnotation(type: Type<any>): any {
      switch (type.kind) {
        case "ArrayType": {
          let elemTypeAnnotation = getTSTypeAnnotation(type.elemType);
          // TODO Improve this test.
          if (namedTypes.TSUnionType.check(elemTypeAnnotation)) {
            elemTypeAnnotation = builders.tsParenthesizedType(elemTypeAnnotation);
          }
          return builders.tsArrayType(elemTypeAnnotation);
        }

        case "IdentityType": {
          if (type.value === null) {
            return builders.tsNullKeyword();
          }
          switch (typeof type.value) {
            case "undefined":
              return builders.tsUndefinedKeyword();
            case "string":
              return builders.tsLiteralType(builders.stringLiteral(type.value));
            case "boolean":
              return builders.tsLiteralType(builders.booleanLiteral(type.value));
            case "number":
              return builders.tsNumberKeyword();
            case "object":
              return builders.tsObjectKeyword();
            case "function":
              return builders.tsFunctionType();
            case "symbol":
              return builders.tsSymbolKeyword();
            default:
              return builders.tsAnyKeyword();
          }
        }

        case "ObjectType": {
          return builders.tsTypeLiteral.from({
            members: type.fields.map(field => getTSPropertySignature(field)),
          });
        }

        case "OrType": {
          return builders.tsUnionType(type.types.map(type => getTSTypeAnnotation(type)));
        }

        case "PredicateType": {
          if (typeof type.name !== "string") {
            return builders.tsAnyKeyword();
          }

          if (hasOwn.call(namedTypes, type.name)) {
            return config.getReferenceToKind(type.name);
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

    function getTSPropertySignature(field: Field<any>): any {
      return builders.tsPropertySignature.from({
        key: builders.identifier(field.name),
        typeAnnotation: builders.tsTypeAnnotation(getTSTypeAnnotation(field.type)),
        optional: field.defaultFn != null || field.hidden,
      });
    }

    return {
      getTSTypeAnnotation,
      getTSPropertySignature,
    };
  }

  return {
    createTSTypeAnnotator,
  };
}
