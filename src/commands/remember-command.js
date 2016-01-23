'use strict';

module.exports = function(commandHistory) {
  return function rememberCommand(command) {
    commandHistory.push(command.str);
    return command;
  };
};
