exports.prompt = function prompt(str) {
  return { type: 'prompt', text: str };
};

exports.command = function command(str) {
  return { type: 'command', text: str };
};

exports.pressEnter = function pressEnter() {
  return { type: 'pressEnter' };
};

exports.lessonComplete = function lessonComplete() {
  return { type: 'lessonComplete' };
};

exports.checkResults = function checkResults(arr) {
  return { type: 'checkResults', expectations: arr };
};

exports.checkForChanges = function checkForChanges(str, arr) {
  return { type: 'checkForChanges', expectations: arr, commandStr: str };
};
