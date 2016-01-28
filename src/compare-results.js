'use strict';

// array equality disregarding indices
function areContentsEqual(arr1, arr2) {
  return arr1.length === arr2.length &&
    arr2.every(val => arr1.indexOf(val) !== -1);
}

function expectedInArrays(arrays, expected) {
  return arrays.some(array => areContentsEqual(array, expected));
}

const checkExpectation = {
  columns(results, expectation) {
    return areContentsEqual(results.columns, expectation.columns);
  },
  includes(results, expectation) {
    const actual = results.values;
    const expected = expectation.values;
    return expected.every(record => expectedInArrays(actual, record));
  },
  excludes(results, expectation) {
    const actual = results.values;
    const expected = expectation.values;
    return !expected.some(record => expectedInArrays(actual, record));
  },
  count(results, expectation) {
    return results.values.length === expectation.count;
  },
};

module.exports = function compareResults(results, expectations) {
  if (results === undefined) return false;
  return expectations.every(expectation =>
    checkExpectation[expectation.type](results, expectation));
};
