import { Fork } from "../types";
import { ASTNode } from "./types";

export interface Builder {
  (...args: any[]): ASTNode;
  from(obj: { [param: string]: any }): ASTNode;
}

export default function buildersPlugin(_fork: Fork) {
  var builders: { [name: string]: Builder } = {};

  return {
    builders,
  };
}
