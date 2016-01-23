'use strict';

// TODO: the current pointer seems to lag behind
//  it effectively starts you at the last item without displaying it

const push = Array.prototype.push;
const splice = Array.prototype.splice;

// remember user commands so they can be browsed with up and down arrow
class CommandHistory {
  constructor(el) {
    this.input = el;
    this.pointer = 0;
  }

  push(value) {
    push.call(this, value);
    this.pointer = this.length - 1;
  }

  back() {
    if (this.pointer > 0) this.pointer--;
    this.input.val(this[this.pointer]);
  }

  forward() {
    if (this.pointer < this.length) this.pointer++;
    this.input.val(this[this.pointer]);
  }

  clear() {
    splice.call(this, 0, this.length);
    this.pointer = 0;
  }
}

module.exports = CommandHistory;
