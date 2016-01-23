// TODO: the current pointer seems to lag behind
//  it effectively starts you at the last item without displaying it

var push = Array.prototype.push;

// remember user commands so they can be browsed with up and down arrow
function CommandHistory(el) {
  this.input = el;
  this.pointer = 0;
}

CommandHistory.prototype.push = function(value) {
  push.call(this, value);
  this.pointer = this.length - 1;
};

CommandHistory.prototype.back = function() {
  if (this.pointer > 0) this.pointer--;
  this.input.val(this[this.pointer]);
};

CommandHistory.prototype.forward = function() {
  if (this.pointer < this.length) this.pointer++;
  this.input.val(this[this.pointer]);
};

CommandHistory.prototype.clear = function() {
  splice.call(this, 0, this.length);
  this.pointer = 0;
}

module.exports = CommandHistory;
