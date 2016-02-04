const compareResults = require('./compare-results.js');
function noop() {} // TODO: extract

// TODO: consider breaking this into separate pieces there is a lot going on
// TODO: rather than providing cleanup methods, perhaps just reuse the object...

// Represents a particular lesson and its connection to the terminal. Listens to
// terminal to know when to check results or for changes. Otherwise after
// starting it with `start()` it basically does its own thing.
//
// Make sure to cleanup with `close()` when you're done.
//
class Lesson {
  constructor(data, db, terminal) {
    this.title = data.title;
    this.steps = data.steps;

    this.terminal = terminal;
    this.db = db;
    this.stepPointer = 0;

    this.checkResults = (results) => this._checkResults(results);
    this.checkSideEffects = () => this._checkSideEffects();
    this.enterPressed = () => this._enterPressed();

    this.db.on('results', this.checkResults);
    this.db.on('evaluate', this.checkSideEffects);
    this.db.on('continue', this.enterPressed);
  }

  start() { this.doStep(); }

  close() {
    this.db.off('results', this.checkResults);
    this.db.off('evaluate', this.checkSideEffects);
    this.db.off('continue', this.enterPressed);
  }

  reset() { /* TODO */ }

  get currentStep() {
    return this.steps[this.stepPointer];
  }

  doStep() {
    const step = this.currentStep;
    this.lessonActions[step.type].call(this, step);
  }

  nextStep() {
    this.stepPointer++;
    this.doStep();
  }

  _checkResults(results) {
    const step = this.currentStep;
    if (['checkResults', 'checkForChanges'].indexOf(step.type) === -1) return;

    if (compareResults(results, step.expectations)) {
      this.terminal.prompt('Success!', ['lesson']);
      this.nextStep();
    }
  }

  _checkSideEffects() {
    const step = this.currentStep;
    if (step.type !== 'checkForChanges') return;

    // TODO: don't use the database in this class
    this._checkResults(this.db.evaluate(step.commandStr));
  }

  _enterPressed() {
    if (this.currentStep.type !== 'pressEnter') return;
    this.nextStep();
  }
}

Lesson.prototype.lessonActions = {
  question(step) {
    this.terminal.prompt(step.text, ['lesson', 'question']);
  },
  prompt(step) {
    this.terminal.prompt(step.text, ['lesson']);
    this.nextStep();
  },
  command(step) {
    this.terminal.execute(step.text, ['lesson']);
    this.nextStep();
  },
  pressEnter() {
    this.terminal.prompt('Press enter to continue.', ['lesson']);
  },
  lessonComplete() {
    this.terminal.prompt('LessonComplete', ['lesson', 'lessonComplete']);
  },
  checkResults: noop,
  checkForChanges: noop,
};

module.exports = Lesson;
