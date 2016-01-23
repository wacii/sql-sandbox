'use strict';

module.exports = function buildRememberCommand(commandHistory) {
  return function rememberCommand(command) {
    commandHistory.push(command.str);
    return command;
  };
};
