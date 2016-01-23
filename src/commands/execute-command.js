'use strict';

module.exports = function(db) {
  return function executeCommand(command) {
    if (command.str === '') return command;
    try {
      const statement = db.prepare(command.str);
      if (statement.step())
        command.results = db.exec(command.str)[0];
    } catch(error) {
      command.error = error;
    } finally {
      return command;
    }
  };
};
