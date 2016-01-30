const template = require('./templates').entryTemplate;
const EventEmitter = require('events');

function render(el, html) {
  el.append(html);
}

module.exports = class Terminal extends EventEmitter {
  constructor(el, evaluate) {
    this.el = el;
    this.evaluate = evaluate;
  }

  prompt(message, classNames = []) {
    render(this.el, template(message, classNames));
  }

  execute(command, classNames = [], hideError = false, hideResults = true) {
    render(this.el,
      template(command, classNames.concat(this.evaluator.classNames))
    );
    this.emit('evaluate', command);
    this.evaluate(command,
      // when results
      (results, html) => {
        // maybe show results
        if (hideResults) return;
        // show results
        render(this.el, template(html, classNames.concat('results')));
        this.emit('results', results);
      },
      // when error
      (error, html) => {
        // maybe show error
        if (hideError) return;
        // show error
        render(this.el, template(html, classNames.concat('error')));
        this.emit('error', error);
      }
    );
  }

  clear() { this.el.empty(); }
};
