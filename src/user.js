// TODO: how to handle enter pressed?
const CommandHistory = require('./command-history');

// Represents a user's connection to the terminal.
//
module.exports = class User {
  constructor(terminal) {
    this.terminal = terminal;
    this.commandHistory = new CommandHistory();
  }

  execute(command) {
    this.commandHistory.push(command);
    this.terminal.execute(command, ['user']);
  }
};
