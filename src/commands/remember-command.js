module.exports = function(commandHistory) {
  return function rememberCommand(command) {
    // TODO: extract assumed stated
    commandHistory.push(command.str);
    return command;
  };
};
