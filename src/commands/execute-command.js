'use strict';

const cloneDeep = require('lodash.clonedeep');

module.exports = function buildExecuteCommand(db) {
  return function executeCommand(input) {
    const command = cloneDeep(input);
    if (command.str === '') return command;
    try {
      const statement = db.prepare(command.str);
      if (statement.step()) command.results = db.exec(command.str)[0];
    } catch (error) {
      command.error = error;
    } finally {
      return command;
    }
  };
};
