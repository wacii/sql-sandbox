module.exports = function prepareCommand(str) {
  if (str == null) str = '';
  return { str: str };
};
