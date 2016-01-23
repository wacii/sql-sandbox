'use strict';

// TODO: handle when results empty, errors are being thrown

const checkExpectation = {
  columns: function(results, expectation) {
    if (results.columns.length !== expectation.columns.length) return false;
    return arrayContains(results.columns, expectation.columns);
  },
  includes: function(results, expectation) {
    const result = results.values;
    return expectation.values.some(value => arrayDeepContains(result, value))
  },
  excludes: function(results, expectation) {
    const result = results.values;
    return expectation.values.every(value => arrayDeepHasNone(result, value));
  },
  count: function(results, expectation) {
    return results != null && results.values.length === expectation.count;
  }
}

function arrayDeepContains(arrays, value) {
  return arrays.some(array => arrayContains(array, value));
}

function arrayDeepHasNone(arrays, value) {
  return arrays.every(array => arrayHasNone(array, value));
}

function arrayContains(arr1, arr2) {
  return arr2.every(array => arr1.indexOf(array) !== -1);
}

function arrayHasNone(arr1, arr2) {
  return arr2.every(array => arr1.indexOf(array) === -1);
}

module.exports = function compareResults(results, expectations) {
  return expectations.every(expectation =>
    checkExpectation[expectation.type](results, expectation));
};
