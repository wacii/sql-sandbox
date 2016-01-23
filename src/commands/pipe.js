'use strict';

const slice = Array.prototype.slice;

module.exports = function pipe(value, ...fns) {
  let fn;
  while (fn = fns.shift())
    value = fn(value);
  return value;
}
