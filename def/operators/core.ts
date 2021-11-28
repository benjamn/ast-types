export default function () {
  return {
    BinaryOperators: [
      "==", "!=", "===", "!==",
      "<", "<=", ">", ">=",
      "<<", ">>", ">>>",
      "+", "-", "*", "/", "%",
      "&",
      "|", "^", "in",
      "instanceof",
    ],

    AssignmentOperators: [
      "=", "+=", "-=", "*=", "/=", "%=",
      "<<=", ">>=", ">>>=",
      "|=", "^=", "&=",
    ],

    LogicalOperators: [
      "||", "&&",
    ],
  };
}
