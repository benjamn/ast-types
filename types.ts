export type Fork = {
  use<T>(plugin: Plugin<T>): T;
};

export type Plugin<T> = (fork: Fork) => T;

export type Def = Plugin<void>;

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface ASTNode {
  type: string;
  // Brand to prevent accidental shape-matching.
  [__astNodeBrand]: typeof __astNodeBrand;
}

declare const __astNodeBrand: unique symbol;
