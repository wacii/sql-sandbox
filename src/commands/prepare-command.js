'use strict';

module.exports = function prepareCommand(str) {
  return { str: str === undefined ? '' : str };
};
