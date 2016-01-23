var slice = Array.prototype.slice;

module.exports = function pipe(value) {
  var fns = slice.call(arguments, 1, arguments.length);
  var fn;
  while (fn = fns.shift())
    value = fn(value);
  return value;
}
