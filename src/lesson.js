function noop() {};
var executeLessonCommand = require('./commands').executeLessonCommand;

function Lesson(title) {
  this.title = title;
  this.steps = [];
  this.stepPointer = 0;
  this.callbacks = {};
}

Lesson.prototype.doStep = function doStep() {
  var step = this.currentStep();
  this.lessonActions[step.type].call(this, step);
};

Lesson.prototype.currentStep = function currentStep() {
  return this.steps[this.stepPointer];
};

Lesson.prototype.nextStep = function nextStep() {
  this.stepPointer++;
  this.doStep();
};

// TODO: extract and improve
Lesson.prototype.on = function on(eventName, callback) {
  if (this.callbacks[eventName] == null)
    this.callbacks[eventName] = [];
  this.callbacks[eventName].push(callback);
};

Lesson.prototype.trigger = function trigger(eventName, data) {
  var callbacks = this.callbacks[eventName] || [];
  callbacks.forEach(function(cb) {
    cb.call(null, data);
  });
};

module.exports = function(logPrompt) {
  Lesson.prototype.lessonActions = {
    prompt: function(step) {
      this.trigger('prompt', step.text);
      this.nextStep();
    },
    command: function(step) {
      this.trigger('execute', step.text);
      this.nextStep();
    },
    pressEnter: function(step) {
      this.trigger('prompt', 'Press enter to continue.');
    },
    lessonComplete: function(step) {
      this.trigger('prompt', 'Lesson complete!')
    },
    checkResults: noop,
    checkForChanges: noop
  }

  return Lesson;
}
