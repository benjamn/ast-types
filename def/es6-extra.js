var types = require("../lib/types");
var def = types.Type.def;

def("AssignmentPattern")
    .bases("Pattern")
    .build("left", "right")
    .field("left", def("Pattern"))
    .field("right", def("Expression"));


def("RestElement")
    .bases("Pattern")
    .build("arguments")
    .field("argument", def("Pattern"));