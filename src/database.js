const SQL = window.SQL; // FIXME
const EventEmitter = require('events');
function noop() {} // TODO: extract

// Encapsulate creation and normal use of a database.
//
module.exports = class Database extends EventEmitter {
  constructor() {
    super();
    this.db = new SQL.Database();
  }

  // Evaluate a command. Returns results if there are any. Emits 'results' and
  // 'error' events with the expected data. Also accepts callbacks.
  //
  // db.evaluate('SELECT * FROM products');
  evaluate(command, onResults = noop, onError = noop) {
    if (command === '') return this.emit('continue');
    this.emit('evaluate', command);

    let statement;
    try {
      statement = this.db.prepare(command);
      if (statement.step()) {
        const results = this.db.exec(command)[0];
        onResults(results);
        this.emit('results', results);
        return results;
      }
    } catch (error) {
      onError(error);
      this.emit('error', error);
    } finally {
      if (statement !== undefined) statement.free();
    }
  }

  reset() {
    this.db.close();
    this.db = new SQL.Database();
  }
};
