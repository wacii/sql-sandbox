const compareResults = require('./compare-results.js');
function noop() {} // TODO: extract

// TODO: consider breaking this into separate pieces
//   there is a lot going on here

// Represents a particular lesson and its connection to the terminal. Listens to
// terminal to know when to check results or for changes. Otherwise after
// starting it with `doStep()` it basically does its own thing.
//
class Lesson {
  constructor(data, terminal, db) {
    this.title = data.title;
    this.steps = data.steps;

    this.terminal = terminal;
    this.db = db;
    this.stepPointer = 0;

    this.terminal.on('results', results => this._checkResults(results));
    this.terminal.on('evaluate', () => this._checkSideffects());
    this.terminal.on('continue', () => this._enterPressed());
  }

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
    if (compareResults(results, this.currentStep.expectations)) {
      this.terminal.prompt('Success!', ['lesson']);
      this.nextStep();
    }
  }

  _checkSideeffects() {
    // TODO: don't use the database in this class
    this._checkResults(this.db.evaluate(this.currentStep.commandStr));
  }

  _enterPressed() {
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
