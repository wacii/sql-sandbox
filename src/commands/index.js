'use strict';

const pipe = require('./pipe');
const prepareCommand = require('./prepare-command');

module.exports = setup;

function setup(db, logEl, currentStep, nextStep, commandHistory, clearInput) {
  const executeCommand = require('./execute-command')(db);

  const log = require('./log')(logEl);
  const logCommand = log.command;
  const logError = log.error;
  const logPrompt = log.prompt;
  const logResults = log.results;

  const rememberCommand = require('./remember-command')(commandHistory);
  const enterPressed = require('./enter-pressed')(currentStep, nextStep);
  const expectation = require('./expectation')(currentStep, nextStep, logPrompt);
  const resultsExpectation = expectation.resultsExpectation;
  const forChangesExpectation = expectation.forChangesExpectation;

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
