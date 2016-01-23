var compareResults = require('../compare-results.js');
var logPrompt = require('./log').prompt;

var pipe = require('./pipe');
var prepareCommand = require('./prepare-command');
var executeCommand = require('./execute-command');

module.exports = function(currentStep, nextStep, logPrompt) {
  return {
    resultsExpectation: function resultsExpectation(command) {
      var step = currentStep();
      if (step.type !== 'checkResults') return command;

      if (compareResults(command.results, step.expectations)) {
        logPrompt('Success!');
        nextStep();
      }
      return command;
    },

    forChangesExpectation: function forChangesExpectation(command) {
      var step = currentStep();
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
