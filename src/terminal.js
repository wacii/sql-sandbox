const templates = require('./templates');
const { entryTemplate, errorTemplate, resultsTemplate } = templates;

// Responsible for rendering text and commands to the screen. Either print plain
// text or SQL commands with corresponding results and errors, both optional.
//
module.exports = class Terminal {
  constructor(el, db) {
    this.el = el;
    this.db = db;
  }

  prompt(message, classNames = []) {
    this._render(entryTemplate(message, classNames));
  }

  execute(command, classNames = [], showError = true, showResults = true) {
    this._render(entryTemplate(command, classNames));
    this.db.evaluate(command,
      (results) => showResults && this._render(resultsTemplate(results)),
      (error) => showError && this._render(errorTemplate(error))
    );
  }

  clear() { this.el.empty(); }

  _render(html) { this.el.append(html); }
};
