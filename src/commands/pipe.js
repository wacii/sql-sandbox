'use strict';

module.exports = function pipe(input, ...fns) {
  return fns.reduce((fn, value) => fn(value), input);
};
