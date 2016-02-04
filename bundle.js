/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// constants
	var ENTER = 13;
	var UP = 38;
	var DOWN = 40;

	var LessonLoader = __webpack_require__(1);
	var Terminal = __webpack_require__(4);
	var User = __webpack_require__(6);
	var Database = __webpack_require__(9);

	var $ = window.$; // FIXME

	var init = function init() {
	  // TODO: attach this to an element, and create the framework from a template

	  // TODO: add setup, maybe just in sandbox mode
	  // textarea containing sql commands run when db is initialized
	  // const setup = $('#setup');
	  // list of previously run sql commands and their results/errors
	  var log = $('#log');
	  // input user enters in sql commands to be run
	  var input = $('#input');
	  // clears log, input, and restores the db with setup code
	  var reset = $('#reset');

	  function clearInput() {
	    input.val('');
	  }

	  var db = new Database();
	  var terminal = new Terminal(log, db);
	  var lessonLoader = new LessonLoader(db, terminal);
	  var lesson = lessonLoader.load(__webpack_require__(10));
	  var user = new User(terminal);

	  lesson.doStep();

	  // TODO: consider interface to user and its relation to the input
	  //   perhaps the object should have more responsibility
	  //   or at the very least better expose command history
	  input.on('keyup', function (event) {
	    if (event.which === ENTER) {
	      user.execute(input.val());
	      input.empty();
	    } else if (event.which === UP) user.commandHistory.back();else if (event.which === DOWN) user.commandHistory.forward();
	  });

	  reset.on('click', function () {
	    clearInput();
	    user.commandHistory.clear();
	    db.reset();
	  });
	};

	window.sqlSandbox = { init: init };

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Lesson = __webpack_require__(2);

	module.exports = function () {
	  function LessonLoader(terminal, db) {
	    _classCallCheck(this, LessonLoader);

	    this.db = db;
	    this.terminal = terminal;
	  }

	  _createClass(LessonLoader, [{
	    key: 'load',
	    value: function load(data) {
	      if (this.currentLesson) this.currentLesson.close();
	      this.currentLesson = new Lesson(data, this.db, this.terminal);
	      this.currentLesson.start();
	      return this.currentLesson;
	    }
	  }]);

	  return LessonLoader;
	}();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var compareResults = __webpack_require__(3);
	function noop() {} // TODO: extract

	// TODO: consider breaking this into separate pieces there is a lot going on
	// TODO: rather than providing cleanup methods, perhaps just reuse the object...

	// Represents a particular lesson and its connection to the terminal. Listens to
	// terminal to know when to check results or for changes. Otherwise after
	// starting it with `start()` it basically does its own thing.
	//
	// Make sure to cleanup with `close()` when you're done.
	//

	var Lesson = function () {
	  function Lesson(data, db, terminal) {
	    var _this = this;

	    _classCallCheck(this, Lesson);

	    this.title = data.title;
	    this.steps = data.steps;

	    this.terminal = terminal;
	    this.db = db;
	    this.stepPointer = 0;

	    this.checkResults = function (results) {
	      return _this._checkResults(results);
	    };
	    this.checkSideEffects = function () {
	      return _this._checkSideEffects();
	    };
	    this.enterPressed = function () {
	      return _this._enterPressed();
	    };

	    this.db.on('results', this.checkResults);
	    this.db.on('evaluate', this.checkSideEffects);
	    this.db.on('continue', this.enterPressed);
	  }

	  _createClass(Lesson, [{
	    key: 'start',
	    value: function start() {
	      this.doStep();
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      this.db.off('results', this._checkResults);
	      this.db.off('evaluate', this._checkSideEffects);
	      this.db.off('continue', this._enterPressed);
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {/* TODO */}
	  }, {
	    key: 'doStep',
	    value: function doStep() {
	      var step = this.currentStep;
	      this.lessonActions[step.type].call(this, step);
	    }
	  }, {
	    key: 'nextStep',
	    value: function nextStep() {
	      this.stepPointer++;
	      this.doStep();
	    }
	  }, {
	    key: '_checkResults',
	    value: function _checkResults(results) {
	      var step = this.currentStep;
	      if (['checkResults', 'checkForChanges'].indexOf(step.type) === -1) return;

	      if (compareResults(results, step.expectations)) {
	        this.terminal.prompt('Success!', ['lesson']);
	        this.nextStep();
	      }
	    }
	  }, {
	    key: '_checkSideEffects',
	    value: function _checkSideEffects() {
	      var step = this.currentStep;
	      if (step.type !== 'checkForChanges') return;

	      // TODO: don't use the database in this class
	      this._checkResults(this.db.evaluate(step.commandStr));
	    }
	  }, {
	    key: '_enterPressed',
	    value: function _enterPressed() {
	      if (this.currentStep.type !== 'pressEnter') return;
	      this.nextStep();
	    }
	  }, {
	    key: 'currentStep',
	    get: function get() {
	      return this.steps[this.stepPointer];
	    }
	  }]);

	  return Lesson;
	}();

	Lesson.prototype.lessonActions = {
	  question: function question(step) {
	    this.terminal.prompt(step.text, ['lesson', 'question']);
	  },
	  prompt: function prompt(step) {
	    this.terminal.prompt(step.text, ['lesson']);
	    this.nextStep();
	  },
	  command: function command(step) {
	    this.terminal.execute(step.text, ['lesson']);
	    this.nextStep();
	  },
	  pressEnter: function pressEnter() {
	    this.terminal.prompt('Press enter to continue.', ['lesson']);
	  },
	  lessonComplete: function lessonComplete() {
	    this.terminal.prompt('LessonComplete', ['lesson', 'lessonComplete']);
	  },

	  checkResults: noop,
	  checkForChanges: noop
	};

	module.exports = Lesson;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	// array equality disregarding indices

	function areContentsEqual(arr1, arr2) {
	  return arr1.length === arr2.length && arr2.every(function (val) {
	    return arr1.indexOf(val) !== -1;
	  });
	}

	function expectedInArrays(arrays, expected) {
	  return arrays.some(function (array) {
	    return areContentsEqual(array, expected);
	  });
	}

	var checkExpectation = {
	  columns: function columns(results, expectation) {
	    return areContentsEqual(results.columns, expectation.columns);
	  },
	  includes: function includes(results, expectation) {
	    var actual = results.values;
	    var expected = expectation.values;
	    return expected.every(function (record) {
	      return expectedInArrays(actual, record);
	    });
	  },
	  excludes: function excludes(results, expectation) {
	    var actual = results.values;
	    var expected = expectation.values;
	    return !expected.some(function (record) {
	      return expectedInArrays(actual, record);
	    });
	  },
	  count: function count(results, expectation) {
	    return results.values.length === expectation.count;
	  }
	};

	module.exports = function compareResults(results, expectations) {
	  if (results === undefined) return false;
	  return expectations.every(function (expectation) {
	    return checkExpectation[expectation.type](results, expectation);
	  });
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var templates = __webpack_require__(5);
	var entryTemplate = templates.entryTemplate;
	var errorTemplate = templates.errorTemplate;
	var resultsTemplate = templates.resultsTemplate;

	// Responsible for rendering text and commands to the screen. Either print plain
	// text or SQL commands with corresponding results and errors, both optional.
	//

	module.exports = function () {
	  function Terminal(el, db) {
	    _classCallCheck(this, Terminal);

	    this.el = el;
	    this.db = db;
	  }

	  _createClass(Terminal, [{
	    key: 'prompt',
	    value: function prompt(message) {
	      var classNames = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	      this._render(entryTemplate(message, classNames));
	    }
	  }, {
	    key: 'execute',
	    value: function execute(command) {
	      var classNames = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	      var _this = this;

	      var showError = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	      var showResults = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

	      this._render(entryTemplate(command, classNames));
	      this.db.evaluate(command, function (results) {
	        return showResults && _this._render(resultsTemplate(results));
	      }, function (error) {
	        return showError && _this._render(errorTemplate(error));
	      });
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.el.empty();
	    }
	  }, {
	    key: '_render',
	    value: function _render(html) {
	      this.el.append(html);
	    }
	  }]);

	  return Terminal;
	}();

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	function tag(tagName, attributes) {
	  return function tagInstance(content) {
	    var attrStr = '';
	    if ((typeof attributes === 'undefined' ? 'undefined' : _typeof(attributes)) === 'object') {
	      var keys = Object.keys(attributes);
	      attrStr = keys.map(function (key) {
	        return key + '=' + attributes[key];
	      }).join(' ');
	    }
	    return '<' + tagName + ' ' + attrStr + '>' + content + '</' + tagName + '>';
	  };
	}

	exports.commandTemplate = tag('li', { class: 'command' });
	exports.errorTemplate = tag('li', { class: 'error' });
	exports.promptTemplate = tag('li', { class: 'prompt' });
	exports.questionTemplate = tag('li', { class: 'question' });

	exports.entryTemplate = function entryTemplate(html, classNames) {
	  return tag('li', { class: classNames.join(' ') })(html);
	};

	exports.resultsTemplate = function resultsTemplate(results) {
	  var headers = tag('tr')(results.columns.map(tag('th')).join(''));
	  var rows = results.values.map(function (record) {
	    return tag('tr')(record.map(tag('td')).join(''));
	  });
	  return tag('li')(tag('table')(headers + rows.join('')));
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// TODO: how to handle enter pressed?
	var CommandHistory = __webpack_require__(7);

	// Represents a user's connection to the terminal.
	//
	module.exports = function () {
	  function User(terminal) {
	    _classCallCheck(this, User);

	    this.terminal = terminal;
	    this.commandHistory = new CommandHistory();
	  }

	  _createClass(User, [{
	    key: 'execute',
	    value: function execute(command) {
	      this.commandHistory.push(command);
	      this.terminal.execute(command, ['user']);
	    }
	  }]);

	  return User;
	}();

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var EventEmitter = __webpack_require__(8);
	var _push = Array.prototype.push;
	var splice = Array.prototype.splice;

	// Remember user commands so they can be browsed with up and down arrow.
	//
	// `push()` new commands onto history instance. Navigate with `back()` and
	// `forward()`. Get current `command`, or listen for `'change'`s.
	//

	var CommandHistory = function (_EventEmitter) {
	  _inherits(CommandHistory, _EventEmitter);

	  function CommandHistory() {
	    _classCallCheck(this, CommandHistory);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CommandHistory).call(this));

	    _this.pointer = 0;
	    return _this;
	  }

	  _createClass(CommandHistory, [{
	    key: 'push',
	    value: function push(value) {
	      _push.call(this, value);
	      this.pointer = this.length;
	    }
	  }, {
	    key: 'back',
	    value: function back() {
	      if (this.pointer > 0) this.pointer--;
	      this.emit('change', this.command);
	    }
	  }, {
	    key: 'forward',
	    value: function forward() {
	      if (this.pointer < this.length) this.pointer++;
	      this.emit('change', this.command);
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      splice.call(this, 0, this.length);
	      this.pointer = 0;
	      this.emit('change', '');
	    }
	  }, {
	    key: 'command',
	    get: function get() {
	      return this[this.pointer];
	    }
	  }]);

	  return CommandHistory;
	}(EventEmitter);

	module.exports = CommandHistory;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function (n) {
	  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function (type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events) this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler)) return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++) {
	      listeners[i].apply(this, args);
	    }
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function (type, listener) {
	  var m;

	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  if (!this._events) this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function (type, listener) {
	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function (type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type]) return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener || isFunction(list.listener) && list.listener === listener) {
	    delete this._events[type];
	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0) return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function (type) {
	  var key, listeners;

	  if (!this._events) return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length) {
	      this.removeListener(type, listeners[listeners.length - 1]);
	    }
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function (type) {
	  var ret;
	  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function (type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function (emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SQL = window.SQL; // FIXME
	var EventEmitter = __webpack_require__(8);
	function noop() {} // TODO: extract

	// Encapsulate creation and normal use of a database.
	//
	module.exports = function (_EventEmitter) {
	  _inherits(Database, _EventEmitter);

	  function Database() {
	    _classCallCheck(this, Database);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Database).call(this));

	    _this.db = new SQL.Database();
	    return _this;
	  }

	  // Evaluate a command. Returns results if there are any. Emits 'results' and
	  // 'error' events with the expected data. Also accepts callbacks.
	  //
	  // db.evaluate('SELECT * FROM products');

	  _createClass(Database, [{
	    key: 'evaluate',
	    value: function evaluate(command) {
	      var onResults = arguments.length <= 1 || arguments[1] === undefined ? noop : arguments[1];
	      var onError = arguments.length <= 2 || arguments[2] === undefined ? noop : arguments[2];

	      if (command === '') return this.emit('continue');
	      this.emit('evaluate', command);

	      var statement = undefined;
	      try {
	        statement = this.db.prepare(command);
	        if (statement.step()) {
	          var results = this.db.exec(command)[0];
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
	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.db.close();
	      this.db = new SQL.Database();
	    }
	  }]);

	  return Database;
	}(EventEmitter);

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
		"title": "Introduction",
		"steps": [{
			"type": "prompt",
			"text": "Welcome to this interactive SQL tutorial. In this lesson you will be learning to request records from an existing database. But first let us create that database just to get you used to the look of SQL queries."
		}, {
			"type": "pressEnter"
		}, {
			"type": "prompt",
			"text": "First we create a table named products with id and name columns."
		}, {
			"type": "command",
			"text": "CREATE TABLE products (id int, name char);"
		}, {
			"type": "pressEnter"
		}, {
			"type": "prompt",
			"text": "Now lets add some records to our products table."
		}, {
			"type": "command",
			"text": "INSERT INTO products (id, name)\nVALUES (1, \"radio\"), (2, \"tv\"), (3, \"tv\");"
		}, {
			"type": "pressEnter"
		}, {
			"type": "prompt",
			"text": "Don't worry if you didn't understand the previous commands. We'll get to those later. But for now, let's start pulling down data!"
		}, {
			"type": "prompt",
			"text": "You can pull down one columns worth of data..."
		}, {
			"type": "command",
			"text": "SELECT id FROM products;"
		}, {
			"type": "pressEnter"
		}, {
			"type": "prompt",
			"text": "Specify multiple columns specifically..."
		}, {
			"type": "command",
			"text": "SELECT id, name FROM products;"
		}, {
			"type": "pressEnter"
		}, {
			"type": "prompt",
			"text": "Or just grab all the columns..."
		}, {
			"type": "command",
			"text": "SELECT * FROM products;"
		}, {
			"type": "pressEnter"
		}, {
			"type": "prompt",
			"text": "You try. Fetch all names of products."
		}, {
			"type": "checkResults",
			"expectations": [{
				"type": "columns",
				"columns": ["name"]
			}, {
				"type": "count",
				"count": 3
			}]
		}, {
			"type": "prompt",
			"text": "Now fetch all the columns"
		}, {
			"type": "checkResults",
			"expectations": [{
				"type": "columns",
				"columns": ["id", "name"]
			}, {
				"type": "count",
				"count": 3
			}]
		}, {
			"type": "prompt",
			"text": "Set conditions on the query with the where clause."
		}, {
			"type": "command",
			"text": "SELECT * FROM products WHERE id >= 2;"
		}, {
			"type": "pressEnter"
		}, {
			"type": "prompt",
			"text": "Test if values are equal with '=', inequal with '<>' or null with 'IS NULL'. Conditions can be grouped with 'AND' and 'OR' and negated with 'NOT'."
		}, {
			"type": "prompt",
			"text": "Fetch all products with id not equal to 1."
		}, {
			"type": "checkResults",
			"expectations": [{
				"type": "includes",
				"values": [[2, "tv"], [3, "tv"]]
			}, {
				"type": "count",
				"count": 2
			}]
		}, {
			"type": "prompt",
			"text": "That's it for this lesson. Next we will learn how to limit the number of results a query returns as well as control its order."
		}, {
			"type": "lessonComplete"
		}]
	};

/***/ }
/******/ ]);