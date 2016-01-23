var pipe = require('./pipe');
var prepareCommand = require('./prepare-command');

module.exports = setup;

function setup(db, log, currentStep, nextStep, commandHistory, clearInput) {
  var executeCommand = require('./execute-command')(db);

  var log = require('./log')(log);
  var logCommand = log.command;
  var logError = log.error;
  var logPrompt = log.prompt;
  var logResults = log.results;

  var rememberCommand = require('./remember-command')(commandHistory);
  var enterPressed = require('./enter-pressed')(currentStep, nextStep);
  var expectation = require('./expectation')(currentStep, nextStep, logPrompt);
  var resultsExpectation = expectation.resultsExpectation;
  var forChangesExpectation = expectation.forChangesExpectation;
  
  return {
    logPrompt: logPrompt,

    executeSetupCommand: function(str) {
      pipe(str, prepareCommand, executeCommand, logError);
    },

    executeUserCommand: function(str) {
      pipe(str, prepareCommand,
        executeCommand, rememberCommand, logCommand, logResults, logError,
        enterPressed, resultsExpectation, forChangesExpectation);
      clearInput();
    },

    executeLessonCommand: function(str) {
      pipe(str, prepareCommand,
        executeCommand, logCommand, logResults, logError);
    }
  }
}
