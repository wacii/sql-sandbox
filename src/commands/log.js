var templates = require('../templates');

var errorTemplate = templates.errorTemplate;
var resultsTemplate = templates.resultsTemplate;
var commandTemplate = templates.commandTemplate;
var promptTemplate = templates.promptTemplate;

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
