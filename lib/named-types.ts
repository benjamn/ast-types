import { Fork } from "../types";
import { AnyType } from "./types";

export default function namedTypesPlugin(_fork: Fork) {
  var namedTypes: { [name: string]: AnyType } = {};

  return {
    namedTypes,
  };
}
