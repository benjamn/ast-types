export function assertNever(x: never): never {
  throw new Error("Unexpected: " + x);
}

export function shallowStringify(value: any): string {
  if (Array.isArray(value)) {
    return "[" + value.map(shallowStringify).join(", ") + "]";
  }

  if (value && typeof value === "object") {
    return "{ " + Object.keys(value).map(function (key) {
      return key + ": " + value[key];
    }).join(", ") + " }";
  }

  return JSON.stringify(value);
}
