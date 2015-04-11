var types = require('./main');
var n = types.namedTypes;
var def = types.Type.def;
var getBuilderName = require('./lib/types').getBuilderName;

if (true) Object.keys(n).forEach(function(fieldName) {
  if(!fieldName) return;
  var d = def(fieldName);
  if(!d.buildable) return;
  var builderName = getBuilderName(d.typeName);
  var allFields = d.allFields;
  var buildParams = d.buildParams;

  var paramTypes = Object.keys(allFields).map(function(paramName) {
    var field = allFields[paramName];
    var type = field.type + '';
    return field.name + ':' + type;
  });

  console.log(builderName + '(' + paramTypes.join(', ') + ')');
});

function print(typeName) {
  var d = def(typeName);
  var header = typeName
  if(d.baseNames.length) {
    header += ' extends ' + d.baseNames.join(', ');
  }
  console.log(header + ' {');

  var allFields = d.allFields;
  var paramTypes = Object.keys(d.ownFields).map(function(paramName) {
    var field = allFields[paramName];
    var type = field.type;
    var ret =  field.name + ':' + type;
    //if(paramName ==='type') ret += '(' + ( typeof type ) + ')';
    //console.log(types.getFieldNames(type));
    return ret;
  });

  console.log('\t' + paramTypes.join('\n\t'));
  console.log('}')
}

function createTypes(type) {
  type = type.trim();
  var isArray = type.match(/^\[.*\]$/);
  if(isArray) type = type.substring(1, type.length-1);
  if(isArray) type += '[]';
  return type
}

console.log(createTypes('[Expression]'));

print('SourceLocation');
print('Position');
print('Printable');
print('Comment');
print('Node');
print('Pattern');
print('Expression');
print('AssignmentExpression');
print('Identifier');
print('TypeAnnotation');
print('Type');
print('Statement');
print('ReturnStatement');