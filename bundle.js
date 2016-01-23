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
	var push = Array.prototype.push;
	var slice = Array.prototype.slice;
	var splice = Array.prototype.splice;

	var CommandHistory = __webpack_require__(1);
	var Lesson = __webpack_require__(2);
	var commandBuilder = __webpack_require__(3);
	var intro = __webpack_require__(13);

	window.sqlSandbox = { init: init };

	function init() {
	  // TODO: attach this to an element, and create the framework from a template

	  // textarea containing sql commands run when db is initialized
	  var setup = $('#setup');
	  // list of previously run sql commands and their results/errors
	  var log = $('#log');
	  // input user enters in sql commands to be run
	  var input = $('#input');
	  // clears log, input, and restores the db with setup code
	  var reset = $('#reset');

	  function clearInput() {
	    input.val('');
	  }
	  function clearLog() {
	    log.empty();
	  }

	  var lesson = new Lesson('Intro');
	  lesson.steps = intro;
	  var currentStep = lesson.currentStep.bind(lesson);
	  var nextStep = lesson.nextStep.bind(lesson);

	  var commandHistory = new CommandHistory(input);
	  var db = new SQL.Database();

	  // TODO: pass lesson not bound lesson methods
	  var command = commandBuilder(db, log, currentStep, nextStep, commandHistory, clearInput);

	  command.executeSetupCommand(setup.val());

	  lesson.on('prompt', command.logPrompt);
	  lesson.on('execute', command.executeLessonCommand);

	  lesson.doStep();
	  input.on('keyup', function (event) {
	    if (event.which === ENTER) command.executeUserCommand(input.val());else if (event.which === UP) commandHistory.back();else if (event.which === DOWN) commandHistory.forward();
	  });

	  reset.on('click', function (event) {
	    clearInput();
	    clearLog();
	    commandHistory.clear();
	    resetDb();
	  });

	  // TODO: consider making a db object
	  // TODO: should lesson be reset?
	  function resetDb() {
	    db.close();
	    db = new SQL.Database();
	    command.executeSetupCommand(setup.val());
	  }
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	// TODO: the current pointer seems to lag behind
	//  it effectively starts you at the last item without displaying it

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _push = Array.prototype.push;
	var splice = Array.prototype.splice;

	// remember user commands so they can be browsed with up and down arrow

	var CommandHistory = function () {
	  function CommandHistory(el) {
	    _classCallCheck(this, CommandHistory);

	    this.input = el;
	    this.pointer = 0;
	  }

	  _createClass(CommandHistory, [{
	    key: 'push',
	    value: function push(value) {
	      _push.call(this, value);
	      this.pointer = this.length - 1;
	    }
	  }, {
	    key: 'back',
	    value: function back() {
	      if (this.pointer > 0) this.pointer--;
	      this.input.val(this[this.pointer]);
	    }
	  }, {
	    key: 'forward',
	    value: function forward() {
	      if (this.pointer < this.length) this.pointer++;
	      this.input.val(this[this.pointer]);
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      splice.call(this, 0, this.length);
	      this.pointer = 0;
	    }
	  }]);

	  return CommandHistory;
	}();

	module.exports = CommandHistory;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function noop() {};

	var Lesson = function () {
	  function Lesson(title) {
	    _classCallCheck(this, Lesson);

	    this.title = title;
	    this.steps = [];
	    this.stepPointer = 0;
	    this.callbacks = {};
	  }

	  _createClass(Lesson, [{
	    key: 'doStep',
	    value: function doStep() {
	      var step = this.currentStep();
	      this.lessonActions[step.type].call(this, step);
	    }
	  }, {
	    key: 'currentStep',
	    value: function currentStep() {
	      return this.steps[this.stepPointer];
	    }
	  }, {
	    key: 'nextStep',
	    value: function nextStep() {
	      this.stepPointer++;
	      this.doStep();
	    }

	    // TODO: extract and improve

	  }, {
	    key: 'on',
	    value: function on(eventName, callback) {
	      if (this.callbacks[eventName] == null) this.callbacks[eventName] = [];
	      this.callbacks[eventName].push(callback);
	    }
	  }, {
	    key: 'trigger',
	    value: function trigger(eventName, data) {
	      var callbacks = this.callbacks[eventName] || [];
	      callbacks.forEach(function (cb) {
	        return cb.call(null, data);
	      });
	    }
	  }]);

	  return Lesson;
	}();

	Lesson.prototype.lessonActions = {
	  prompt: function prompt(step) {
	    this.trigger('prompt', step.text);
	    this.nextStep();
	  },
	  command: function command(step) {
	    this.trigger('execute', step.text);
	    this.nextStep();
	  },
	  pressEnter: function pressEnter(step) {
	    this.trigger('prompt', 'Press enter to continue.');
	  },
	  lessonComplete: function lessonComplete(step) {
	    this.trigger('prompt', 'Lesson complete!');
	  },
	  checkResults: noop,
	  checkForChanges: noop
	};

	module.exports = Lesson;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var pipe = __webpack_require__(4);
	var prepareCommand = __webpack_require__(5);

	module.exports = setup;

	function setup(db, logEl, currentStep, nextStep, commandHistory, clearInput) {
	  var executeCommand = __webpack_require__(6)(db);

	  var log = __webpack_require__(7)(logEl);
	  var logCommand = log.command;
	  var logError = log.error;
	  var logPrompt = log.prompt;
	  var logResults = log.results;

	  var rememberCommand = __webpack_require__(9)(commandHistory);
	  var enterPressed = __webpack_require__(10)(currentStep, nextStep);
	  var expectation = __webpack_require__(11)(currentStep, nextStep, logPrompt);
	  var resultsExpectation = expectation.resultsExpectation;
	  var forChangesExpectation = expectation.forChangesExpectation;

	  return {
	    logPrompt: logPrompt,

	    executeSetupCommand: function executeSetupCommand(str) {
	      pipe(str, prepareCommand, executeCommand, logError);
	    },

	    executeUserCommand: function executeUserCommand(str) {
	      pipe(str, prepareCommand, executeCommand, rememberCommand, logCommand, logResults, logError, enterPressed, resultsExpectation, forChangesExpectation);
	      clearInput();
	    },

	    executeLessonCommand: function executeLessonCommand(str) {
	      pipe(str, prepareCommand, executeCommand, logCommand, logResults, logError);
	    }
	  };
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	var slice = Array.prototype.slice;

	module.exports = function pipe(value) {
	  var fn = undefined;

	  for (var _len = arguments.length, fns = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    fns[_key - 1] = arguments[_key];
	  }

	  while (fn = fns.shift()) {
	    value = fn(value);
	  }return value;
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function prepareCommand(str) {
	  if (str == null) str = '';
	  return { str: str };
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (db) {
	  return function executeCommand(command) {
	    if (command.str === '') return command;
	    try {
	      var statement = db.prepare(command.str);
	      if (statement.step()) command.results = db.exec(command.str)[0];
	    } catch (error) {
	      command.error = error;
	    } finally {
	      return command;
	    }
	  };
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var templates = __webpack_require__(8);

	var errorTemplate = templates.errorTemplate;
	var resultsTemplate = templates.resultsTemplate;
	var commandTemplate = templates.commandTemplate;
	var promptTemplate = templates.promptTemplate;

	module.exports = function (log) {
	  return {
	    error: function logError(command) {
	      if (command.error != null) addToLog(errorTemplate(command.error));
	      return command;
	    },

	    results: function logResults(command) {
	      if (command.results != null) addToLog(resultsTemplate(command.results));
	      return command;
	    },

	    command: function logCommand(command) {
	      addToLog(commandTemplate(command.str));
	      return command;
	    },

	    prompt: function logPrompt(prompt) {
	      addToLog(promptTemplate(prompt));
	    }
	  };

	  function addToLog(html) {
	    log.append(html);
	  }
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	function tag(tagName, attributes) {
	  return function (content) {
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

	exports.resultsTemplate = function (results) {
	  var headers = tag('tr')(results.columns.map(tag('th')).join(''));
	  var rows = results.values.map(function (record) {
	    return tag('tr')(record.map(tag('td')).join(''));
	  });
	  return tag('li')(tag('table')(headers + rows.join('')));
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (commandHistory) {
	  return function rememberCommand(command) {
	    commandHistory.push(command.str);
	    return command;
	  };
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (currentStep, nextStep) {
	  return function enterPressed(command) {
	    var step = currentStep();
	    if (step == null || step.type !== 'pressEnter') return command;
	    nextStep();
	    return command;
	  };
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var compareResults = __webpack_require__(12);

	var pipe = __webpack_require__(4);
	var prepareCommand = __webpack_require__(5);
	var executeCommand = __webpack_require__(6);

	module.exports = function (currentStep, nextStep, logPrompt) {
	  return {
	    resultsExpectation: function resultsExpectation(command) {
	      var step = currentStep();
	      if (step.type !== 'checkResults') return command;

	      if (compareResults(command.results, step.expectations)) {
	        logPrompt('Success!');
	        nextStep();
	      }
	      return command;
	    },

	    forChangesExpectation: function forChangesExpectation(command) {
	      var step = currentStep();
	      if (step.type !== 'checkForChanges') return command;

	      var results = pipe(step.commandStr, prepareCommand, executeCommand).results;
	      if (compareResults(results, step.expectations)) {
	        logPrompt('Success!');
	        nextStep();
	      }
	      return command;
	    }
	  };
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	// TODO: handle when results empty, errors are being thrown

	var checkExpectation = {
	  columns: function columns(results, expectation) {
	    if (results.columns.length !== expectation.columns.length) return false;
	    return arrayContains(results.columns, expectation.columns);
	  },
	  includes: function includes(results, expectation) {
	    var result = results.values;
	    return expectation.values.some(function (value) {
	      return arrayDeepContains(result, value);
	    });
	  },
	  excludes: function excludes(results, expectation) {
	    var result = results.values;
	    return expectation.values.every(function (value) {
	      return arrayDeepHasNone(result, value);
	    });
	  },
	  count: function count(results, expectation) {
	    return results != null && results.values.length === expectation.count;
	  }
	};

	function arrayDeepContains(arrays, value) {
	  return arrays.some(function (array) {
	    return arrayContains(array, value);
	  });
	}

	function arrayDeepHasNone(arrays, value) {
	  return arrays.every(function (array) {
	    return arrayHasNone(array, value);
	  });
	}

	function arrayContains(arr1, arr2) {
	  return arr2.every(function (array) {
	    return arr1.indexOf(array) !== -1;
	  });
	}

	function arrayHasNone(arr1, arr2) {
	  return arr2.every(function (array) {
	    return arr1.indexOf(array) === -1;
	  });
	}

	module.exports = function compareResults(results, expectations) {
	  return expectations.every(function (expectation) {
	    return checkExpectation[expectation.type](results, expectation);
	  });
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var prompt = __webpack_require__(14).prompt;
	var command = __webpack_require__(14).command;
	var pressEnter = __webpack_require__(14).pressEnter;
	var checkResults = __webpack_require__(14).checkResults;
	var lessonComplete = __webpack_require__(14).lessonComplete;

	module.exports = [prompt('Welcome to the first sql lesson!.'), prompt('You are going to learn how to interact with an existing db.'), prompt('But first lets create a table.'), pressEnter(), prompt('First we create a table.'), prompt('It will be named products and will have id and name columns.'), command('CREATE TABLE products (id int, name char);'), pressEnter(), prompt('Now lets add some data to our products table'), command('INSERT INTO products VALUES (1, "radio"), (2, "tv");'), pressEnter(), prompt('You might not understand the previous commands, but that is ok.'), prompt('Well get to those commands later.'), prompt('Lets start pulling data from our table!'), pressEnter(), prompt('Lets see how to pull all the ids from products'), command('SELECT id FROM products;'), pressEnter(), prompt('Now you try and select all the names from products'), checkResults([{ type: 'columns', columns: ['name'] }]), prompt('Dont select the product with id 1'), checkResults([{ type: 'excludes', values: [[1, "radio"]] }]), prompt('Select all columns of product with id 1'), checkResults([{ type: 'includes', values: [[1, "radio"]] }]), prompt('Select all products'), checkResults([{ type: 'count', count: 2 }]), lessonComplete()];

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	exports.prompt = function prompt(str) {
	  return { type: 'prompt', text: str };
	};

	exports.command = function command(str) {
	  return { type: 'command', text: str };
	};

	exports.pressEnter = function pressEnter() {
	  return { type: 'pressEnter' };
	};

	exports.lessonComplete = function lessonComplete() {
	  return { type: 'lessonComplete' };
	};

	exports.checkResults = function checkResults(arr) {
	  return { type: 'checkResults', expectations: arr };
	};

	exports.checkForChanges = function checkForChanges(str, arr) {
	  return { type: 'checkForChanges', expectations: arr, commandStr: str };
	};

/***/ }
/******/ ]);