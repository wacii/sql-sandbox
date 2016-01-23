'use strict';

const compareResults = require('../compare-results.js');

const pipe = require('./pipe');
const prepareCommand = require('./prepare-command');
const executeCommand = require('./execute-command');

module.exports = function(currentStep, nextStep, logPrompt) {
  return {
    resultsExpectation: function resultsExpectation(command) {
      const step = currentStep();
      if (step.type !== 'checkResults') return command;

      if (compareResults(command.results, step.expectations)) {
        logPrompt('Success!');
        nextStep();
      }
      return command;
    },

    forChangesExpectation: function forChangesExpectation(command) {
      const step = currentStep();
      if (step.type !== 'checkForChanges') return command;

      var results =
        pipe(step.commandStr, prepareCommand, executeCommand).results;
      if (compareResults(results, step.expectations)) {
        logPrompt('Success!');
        nextStep();
      }
      return command;
    }
  };
};
