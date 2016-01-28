'use strict';

module.exports = function pipe(input, ...fns) {
  return fns.reduce((value, fn) => fn(value), input);
};
