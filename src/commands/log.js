'use strict';

const templates = require('../templates');

const errorTemplate = templates.errorTemplate;
const resultsTemplate = templates.resultsTemplate;
const commandTemplate = templates.commandTemplate;
const promptTemplate = templates.promptTemplate;

module.exports = function(log) {
  return {
    error: function logError(command) {
      if (command.error != null)
        addToLog(errorTemplate(command.error));
      return command;
    },

    results: function logResults(command) {
      if (command.results != null)
        addToLog(resultsTemplate(command.results));
      return command;
    },

    command: function logCommand(command) {
      addToLog(commandTemplate(command.str));
      return command;
    },

    prompt: function logPrompt(prompt) {
      addToLog(promptTemplate(prompt));
    }
  };

  function addToLog(html) {
    log.append(html);
  }
};
