const eql = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

function p(item, description) {
  if (description !== undefined) console.log(description);
  if (Array.isArray(item)) {
    console.log('---Array---');
    item.forEach(function(value) {
      console.log(value);
    });
    console.log('----end----');
  } else {
    console.log(item);
  }
  console.log('\n');
}

function pa(item, description) {
  return p(item, description);
}

function assertEqual(expected, func, args) {
  var funcArgs = Array.prototype.slice.call(arguments, 2)
  var funcResult = func(...funcArgs);

  console.log(func.name, funcArgs, 'should result in: ' + expected);
  console.log(eql(funcResult, expected) ? 'passed' : 'FAILED : ' + JSON.stringify(funcResult));
}

function partial(primary, arg1) {
  return function(arg2) {
    return primary(arg1, arg2);
  };
}
