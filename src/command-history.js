const EventEmitter = require('events');
const push = Array.prototype.push;
const splice = Array.prototype.splice;

// Remember user commands so they can be browsed with up and down arrow.
//
// `push()` new commands onto history instance. Navigate with `back()` and
// `forward()`. Get current `command`, or listen for `'change'`s.
//
class CommandHistory extends EventEmitter {
  constructor() {
    super();
    this.pointer = 0;
  }

  get command() {
    return this[this.pointer];
  }

  push(value) {
    push.call(this, value);
    this.pointer = this.length;
  }

  back() {
    if (this.pointer > 0) this.pointer--;
    this.emit('change', this.command);
  }

  forward() {
    if (this.pointer < this.length) this.pointer++;
    this.emit('change', this.command);
  }

  clear() {
    splice.call(this, 0, this.length);
    this.pointer = 0;
    this.emit('change', '');
  }
}

module.exports = CommandHistory;
