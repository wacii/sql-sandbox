const SQL = window.SQL; // FIXME
const resultsTemplate = require('./templates').resultsTemplate;
function noop() {} // TODO: extract somewhere

// NOTE: consider using error template for error message and just
//   adding the connection class to the container <li> in terminal

// Encapsulate creation and normal use of a database.
//
module.exports = class Database {
  constructor() {
    this.db = new SQL.Database();
  }

  // TODO: this is all kinds of messy
  get classNames() {
    return ['sql'];
  }

  // Evaluate a command, with callbacks to handle results and errors.
  //
  // onResults(results, html)
  // onError(error, html)
  //
  // db.evaluate('SELECT * FROM products', logResults, logError);
  evaluate(command, onResults = noop, onError = noop) {
    let statement;
    try {
      statement = this.db.prepare(command);
      if (statement.step()) {
        const results = this.db.exec(command)[0];
        onResults(results, resultsTemplate(results));
        return results;
      }
    } catch (error) {
      onError(error, error);
    } finally {
      if (statement !== undefined) statement.free();
    }
  }

  reset() {
    this.db.close();
    this.db = new SQL.Database();
  }
};
