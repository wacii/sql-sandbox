'use strict';

function noop() {}

class Lesson {
  constructor(obj) {
    this.title = obj.title;
    this.steps = obj.steps;
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
    if (this.callbacks[eventName] === undefined) this.callbacks[eventName] = [];
    this.callbacks[eventName].push(callback);
  }

  trigger(eventName, data) {
    const callbacks = this.callbacks[eventName] || [];
    callbacks.forEach(cb => cb.call(null, data));
  }
}

Lesson.prototype.lessonActions = {
  prompt(step) {
    this.trigger('prompt', step.text);
    this.nextStep();
  },
  command(step) {
    this.trigger('execute', step.text);
    this.nextStep();
  },
  pressEnter() {
    this.trigger('prompt', 'Press enter to continue.');
  },
  lessonComplete() {
    this.trigger('prompt', 'Lesson complete!');
  },
  checkResults: noop,
  checkForChanges: noop,
};

module.exports = Lesson;
