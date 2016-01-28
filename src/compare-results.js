'use strict';

function arrayContains(arr1, arr2) {
  return arr2.every(array => arr1.indexOf(array) !== -1);
}

function arrayHasNone(arr1, arr2) {
  return arr2.every(array => arr1.indexOf(array) === -1);
}

function arrayDeepContains(arrays, value) {
  return arrays.some(array => arrayContains(array, value));
}

function arrayDeepHasNone(arrays, value) {
  return arrays.every(array => arrayHasNone(array, value));
}

const checkExpectation = {
  columns(results, expectation) {
    if (results === undefined) return false;
    if (results.columns.length !== expectation.columns.length) return false;
    return arrayContains(results.columns, expectation.columns);
  },
  includes(results, expectation) {
    if (results === undefined) return false;
    const result = results.values;
    return expectation.values.some(value => arrayDeepContains(result, value));
  },
  excludes(results, expectation) {
    if (results === undefined) return false;
    const result = results.values;
    return expectation.values.every(value => arrayDeepHasNone(result, value));
  },
  count(results, expectation) {
    return results !== undefined && results.values.length === expectation.count;
  },
};

module.exports = function compareResults(results, expectations) {
  return expectations.every(expectation =>
    checkExpectation[expectation.type](results, expectation));
};
