import { Fork } from "../types";
import typesPlugin from "./types";

export default function (fork: Fork) {
    var types = fork.use(typesPlugin);
    var Type = types.Type;
    var builtin = types.builtInTypes;
    var isNumber = builtin.number;

    // An example of constructing a new type with arbitrary constraints from
    // an existing type.
    function geq(than: any) {
        return Type.from(
            (value: number) => isNumber.check(value) && value >= than,
            isNumber + " >= " + than,
        );
    };

    // Default value-returning functions that may optionally be passed as a
    // third argument to Def.prototype.field.
    const defaults = {
        // Functions were used because (among other reasons) that's the most
        // elegant way to allow for the emptyArray one always to give a new
        // array instance.
        "null": function () { return null },
        "emptyArray": function () { return [] },
        "false": function () { return false },
        "true": function () { return true },
        "undefined": function () {},
        "use strict": function () { return "use strict"; }
    };

    var naiveIsPrimitive = Type.or(
      builtin.string,
      builtin.number,
      builtin.boolean,
      builtin.null,
      builtin.undefined
    );

    const isPrimitive = Type.from(
        (value: any) => {
            if (value === null)
                return true;
            var type = typeof value;
            if (type === "object" ||
                type === "function") {
                return false;
            }
            return true;
        },
        naiveIsPrimitive.toString(),
    );

    return {
        geq,
        defaults,
        isPrimitive,
    };
};
