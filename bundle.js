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

	// constants
	var ENTER = 13;
	var UP = 38;
	var DOWN = 40;
	var push = Array.prototype.push;
	var slice = Array.prototype.slice;
	var splice = Array.prototype.splice;

	var CommandHistory = __webpack_require__(1);

	var lesson = __webpack_require__(2);
	var currentStep = lesson.currentStep.bind(lesson);
	var nextStep = lesson.nextStep.bind(lesson);

	window.sqlSandbox = { init: init };

	function init() {
	  // TODO: attach this to an element, and create the framework from a template

	  // textarea containing sql commands run when db is initialized
	  var setup = $('#setup')
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

	  var commandHistory = new CommandHistory(input);
	  var db = new SQL.Database();

	  // TODO: consider moving to events...separate concerns
	  var command = __webpack_require__(4)(
	    db, log, currentStep, nextStep, commandHistory, clearInput
	  );
	  var executeUserCommand = command.executeUserCommand;
	  var executeSetupCommand = command.executeSetupCommand;

	  executeSetupCommand(setup.val());
	  lesson.doStep();

	  input.on('keyup', function(event) {
	    if (event.which === ENTER) executeUserCommand(input.val());
	    else if (event.which === UP) commandHistory.back();
	    else if (event.which === DOWN) commandHistory.forward();
	  });

	  reset.on('click', function(event) {
	    clearInput();
	    clearLog();
	    commandHistory.clear();
	    resetDb();
	  });

	  // TODO: consider making a db object
	  function resetDb() {
	    db.close();
	    db = new SQL.Database();
	    executeSetupCommand(setup.val());
	  }
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Lesson = __webpack_require__(3);

	var prompt = __webpack_require__(13).prompt;
	var command = __webpack_require__(13).command;
	var pressEnter = __webpack_require__(13).pressEnter;
	var checkResults = __webpack_require__(13).checkResults;
	var lessonComplete = __webpack_require__(13).lessoncomplete;

	var lesson = new Lesson('Intro');

	lesson.steps = [
	  prompt('Welcome to the first sql lesson!.'),
	  prompt('You are going to learn how to interact with an existing db.'),
	  prompt('But first lets create a table.'),
	  pressEnter(),
	  prompt('First we create a table.'),
	  prompt('It will be named products and will have id and name columns.'),
	  command('CREATE TABLE products (id int, name char);'),
	  pressEnter(),
	  prompt('Now lets add some data to our products table'),
	  command('INSERT INTO products VALUES (1, "radio"), (2, "tv");'),
	  pressEnter(),
	  prompt('You might not understand the previous commands, but that is ok.'),
	  prompt('Well get to those commands later.'),
	  prompt('Lets start pulling data from our table!'),
	  pressEnter(),
	  prompt('Lets see how to pull all the ids from products'),
	  command('SELECT id FROM products;'),
	  pressEnter(),
	  prompt('Now you try and select all the names from products'),
	  checkResults([{ type: 'columns', columns: ['name'] }]),
	  prompt('Dont select the product with id 1'),
	  checkResults([{ type: 'excludes', values: [[1, "radio"]] }]),
	  prompt('Select all columns of product with id 1'),
	  checkResults([{ type: 'includes', values: [[1, "radio"]] }]),
	  prompt('Select all products'),
	  checkResults([{ type: 'count', count: 2 }]),
	  lessonComplete()
	];

	module.exports = lesson;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	function noop() {};
	var executeLessonCommand = __webpack_require__(4).executeLessonCommand;

	function Lesson(title) {
	  this.title = title;
	  this.steps = [];
	  this.stepPointer;
	}

	Lesson.prototype.doStep = function doStep() {
	  var step = currentStep();
	  this.lessonActions[step.type](step);
	};

	Lesson.prototype.currentStep = function currentStep() {
	  return this.steps[this.stepPointer];
	};

	Lesson.prototype.nextStep = function nextStep() {
	  this.stepPointer++;
	  this.doStep();
	}

	module.exports = function(logPrompt) {
	  Lesson.prototype.lessonActions = {
	    prompt: function(step) {
	      logPrompt(step.text);
	      this.nextStep();
	    },
	    command: function(step) {
	      executeLessonCommand(step.text);
	      this.nextStep();
	    },
	    pressEnter: function(step) {
	      logPrompt('Press enter to continue.');
	    },
	    lessonComplete: function(step) {
	      logPrompt('Lesson complete!');
	    },
	    checkResults: noop,
	    checkForChanges: noop
	  }

	  return Lesson;
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var pipe = __webpack_require__(5);
	var prepareCommand = __webpack_require__(6);

	module.exports = setup;

	function setup(db, log, currentStep, nextStep, commandHistory, clearInput) {
	  var executeCommand = __webpack_require__(7)(db);

	  var log = __webpack_require__(8)(log);
	  var logCommand = log.command;
	  var logError = log.error;
	  var logPrompt = log.prompt;
	  var logResults = log.results;

	  var enterPressed = __webpack_require__(10)(currentStep, nextStep);
	  var expectation = __webpack_require__(11)(currentStep, nextStep);
	  var resultsExpectation = expectation.resultsExpectation;
	  var forChangesExpectation = expectation.forChangesExpectation;

	  return {
	    executeSetupCommand: function(str) {
	      pipe(str, prepareCommand, executeCommand, logError);
	    },

	    executeUserCommand: function(str) {
	      pipe(str, prepareCommand,
	        executeCommand, rememberCommand, logCommand, logResults, logError,
	        enterPressed, resultsExpectation, forChangesExpectation);
	      clearInput();
	    },

	    executeLessonCommand: function(str) {
	      pipe(str, prepareCommand,
	        executeCommand, logCommand, logResults, logError);
	    }
	  }
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function pipe(value) {
	  var fns = slice.call(arguments, 1, arguments.length);
	  var fn;
	  while (fn = fns.shift())
	    value = fn(value);
	  return value;
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function prepareCommand(str) {
	  if (str == null) str = '';
	  return { str: str };
	};


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = function(db) {
	  return function executeCommand(command) {
	    if (command.str === '') return command;
	    try {
	      var statement = db.prepare(command.str);
	      if (statement.step())
	        command.results = db.exec(command.str)[0];
	    } catch(error) {
	      command.error = error;
	    } finally {
	      return command;
	    }
	  };
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var templates = __webpack_require__(9);

	var errorTemplate = templates.errorTemplate;
	var resultsTemplate = templates.resultsTemplate;
	var commandTemplate = templates.commandTemplate;
	var promptTemplate = templates.promptTemplate;

	module.exports = function(log) {
	  return {
	    error: function logError(command) {
	      if (command.error != null)
	        addToLog(errorTemplate(command.error));
	      return command;
	    },

	    results: function logResults(command) {
	      if (command.results != null)
	        addToLog(resultsTemplate(command.results));
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
/* 9 */
/***/ function(module, exports) {

	function tag(tagName, attributes) {
	  return function(content) {
	    var attrStr = ''
	    if (typeof attributes === 'object') {
	      var keys = Object.keys(attributes);
	      attrStr = keys.map(function(key) {
	        return key + '=' + attributes[key];
	      }).join(' ');
	    }
	    return '<' + tagName + ' ' + attrStr + '>' +
	      content + '</' + tagName + '>';
	  }
	}

	exports.commandTemplate = tag('li', { class: 'command' });
	exports.errorTemplate = tag('li', { class: 'error' });
	exports.promptTemplate = tag('li', { class: 'prompt' });

	exports.resultsTemplate = function(results) {
	  var headers = tag('tr')(results.columns.map(tag('th')).join(''));
	  var rows = results.values.map(function(record) {
	    return tag('tr')(record.map(tag('td')).join(''));
	  });
	  return tag('li')(tag('table')(headers + rows.join('')));
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function(currentStep, nextStep) {
	  function enterPressed(command) {
	    var step = currentStep();
	    if (step == null || step.type !== 'pressEnter') return command;
	    nextStep();
	    return command;
	  };
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var compareResults = __webpack_require__(12);
	var logPrompt = __webpack_require__(8).prompt;

	var pipe = __webpack_require__(5);
	var prepareCommand = __webpack_require__(6);
	var executeCommand = __webpack_require__(7);

	exports.resultsExpectation = function(currentStep, nextStep) {
	  return function resultsExpectation(command) {
	    var step = currentStep();
	    if (step.type !== 'checkResults') return command;

	    if (compareResults(command.results, step.expectations)) {
	      logPrompt('Success!');
	      nextStep;
	    }
	    return command;
	  };
	};

	exports.forChangesExpectation = function(currentStep, nextStep) {
	  return function forChangesExpectation(command) {
	    var step = currentStep();
	    if (step.type !== 'checkForChanges') return command;

	    results = pipe(step.commandStr, prepareCommand, executeCommand).results
	    if (compareResults(results, step.expectations)) {
	      logPrompt('Success!');
	      nextStep;
	    }
	    return command;
	  };
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	checkExpectation = {
	  columns: function(results, expectation) {
	    if (results.columns.length !== expectation.columns.length) return false;
	    return arrayContains(results.columns, expectation.columns);
	  },
	  includes: function(results, expectation) {
	    var result = results.values;
	    var expected = expectation.values;

	    var len = expected.length;
	    for (var i = 0; i < len; i++)
	      if (!arrayDeepContains(result, expected[i])) return false;
	    return true;
	  },
	  excludes: function(results, expectation) {
	    var result = results.values;
	    var expected = expectation.values;

	    var len = expected.length;
	    for (var i = 0; i < len; i++)
	      if (!arrayDeepHasNone(result, expected[i])) return false;
	    return true;
	  },
	  count: function(results, expectation) {
	    return results != null && results.values.length === expectation.count;
	  }
	}

	function arrayDeepContains(arrays, arr) {
	  var len = arrays.length;
	  for (var i = 0; i < len; i++)
	    if (!arrayContains(arrays[i], arr)) return false;
	  return true;
	}

	function arrayDeepHasNone(arrays, arr) {
	  var len = arrays.length;
	  for (var i = 0; i < len; i++)
	    if (!arrayHasNone(arrays[i], arr)) return false;
	  return true;
	}

	function arrayContains(arr1, arr2) {
	  var len = arr2.length;
	  for (var i = 0; i < len; i++)
	    if (arr1.indexOf(arr2[i]) === -1) return false;
	  return true;
	}

	function arrayHasNone(arr1, arr2) {
	  var len = arr2.length;
	  for (var i = 0; i < len; i++)
	    if (arr1.indexOf(arr2[i]) !== -1) return false;
	  return true;
	}

	module.exports = function compareResults(results, expectations) {
	  var len = expectations.length;
	  for (var i = 0; i < len; i++) {
	    var expectation = expectations[i];
	    if(!checkExpectation[expectation.type](results, expectation))
	      return false;
	  }
	  return true;
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

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