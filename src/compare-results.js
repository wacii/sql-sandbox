// TODO: handle when results empty, errors are being thrown

checkExpectation = {
  columns: function(results, expectation) {
    if (results.columns.length !== expectation.columns.length) return false;
    return arrayContains(results.columns, expectation.columns);
  },
  includes: function(results, expectation) {
    var result = results.values;
    var expected = expectation.values;

    var len = expected.length;
    for (var i = 0; i < len; i++)
      if (!arrayDeepContains(result, expected[i])) return false;
    return true;
  },
  excludes: function(results, expectation) {
    var result = results.values;
    var expected = expectation.values;

    var len = expected.length;
    for (var i = 0; i < len; i++)
      if (!arrayDeepHasNone(result, expected[i])) return false;
    return true;
  },
  count: function(results, expectation) {
    return results != null && results.values.length === expectation.count;
  }
}

function arrayDeepContains(arrays, arr) {
  var len = arrays.length;
  for (var i = 0; i < len; i++)
    if (!arrayContains(arrays[i], arr)) return false;
  return true;
}

function arrayDeepHasNone(arrays, arr) {
  var len = arrays.length;
  for (var i = 0; i < len; i++)
    if (!arrayHasNone(arrays[i], arr)) return false;
  return true;
}

function arrayContains(arr1, arr2) {
  var len = arr2.length;
  for (var i = 0; i < len; i++)
    if (arr1.indexOf(arr2[i]) === -1) return false;
  return true;
}

function arrayHasNone(arr1, arr2) {
  var len = arr2.length;
  for (var i = 0; i < len; i++)
    if (arr1.indexOf(arr2[i]) !== -1) return false;
  return true;
}

module.exports = function compareResults(results, expectations) {
  var len = expectations.length;
  for (var i = 0; i < len; i++) {
    var expectation = expectations[i];
    if(!checkExpectation[expectation.type](results, expectation))
      return false;
  }
  return true;
};
