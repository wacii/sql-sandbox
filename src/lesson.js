'use strict';

function noop() {};

class Lesson {
  constructor(title) {
    this.title = title;
    this.steps = [];
    this.stepPointer = 0;
    this.callbacks = {};
  }

  doStep() {
    const step = this.currentStep();
    this.lessonActions[step.type].call(this, step);
  }

  currentStep() {
    return this.steps[this.stepPointer];
  }

  nextStep() {
    this.stepPointer++;
    this.doStep();
  }

  // TODO: extract and improve
  on(eventName, callback) {
    if (this.callbacks[eventName] == null)
      this.callbacks[eventName] = [];
    this.callbacks[eventName].push(callback);
  }

  trigger(eventName, data) {
    const callbacks = this.callbacks[eventName] || [];
    callbacks.forEach(cb => cb.call(null, data));
  }
}

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

module.exports = Lesson;
