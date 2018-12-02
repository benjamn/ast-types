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
      const privateType = type.__type;

      switch (privateType.kind) {
        case "ArrayType": {
          let elemTypeAnnotation = getTSTypeAnnotation(privateType.elemType);
          // TODO Improve this test.
          if (namedTypes.TSUnionType.check(elemTypeAnnotation)) {
            elemTypeAnnotation = builders.tsParenthesizedType(elemTypeAnnotation);
          }
          return builders.tsArrayType(elemTypeAnnotation);
        }

        case "IdentityType": {
          if (privateType.value === null) {
            return builders.tsNullKeyword();
          }
          switch (typeof privateType.value) {
            case "undefined":
              return builders.tsUndefinedKeyword();
            case "string":
              return builders.tsLiteralType(builders.stringLiteral(privateType.value));
            case "boolean":
              return builders.tsLiteralType(builders.booleanLiteral(privateType.value));
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
            members: privateType.fields.map(field => getTSPropertySignature(field)),
          });
        }

        case "OrType": {
          return builders.tsUnionType(privateType.types.map(type => getTSTypeAnnotation(type)));
        }

        case "PredicateType": {
          if (typeof privateType.name !== "string") {
            return builders.tsAnyKeyword();
          }

          if (hasOwn.call(namedTypes, privateType.name)) {
            return config.getReferenceToKind(privateType.name);
          }

          if (/^[$A-Z_][a-z0-9_$]*$/i.test(privateType.name)) {
            return builders.tsTypeReference(builders.identifier(privateType.name));
          }

          if (/^number [<>=]+ \d+$/.test(privateType.name)) {
            return builders.tsNumberKeyword();
          }

          // Not much else to do...
          return builders.tsAnyKeyword();
        }

        default:
          return assertNever(privateType);
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
