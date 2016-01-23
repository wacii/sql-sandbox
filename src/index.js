// constants
var ENTER = 13;
var UP = 38;
var DOWN = 40;
var push = Array.prototype.push;
var slice = Array.prototype.slice;
var splice = Array.prototype.splice;

var CommandHistory = require('./command-history');

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

  var lesson = new (require('./lesson')(log))('Intro');
  lesson.steps = require('../lessons/intro');
  var currentStep = lesson.currentStep.bind(lesson);
  var nextStep = lesson.nextStep.bind(lesson);

  var commandHistory = new CommandHistory(input);
  var db = new SQL.Database();

  // TODO: pass lesson not bound lesson methods
  var command = require('./commands')(
    db, log, currentStep, nextStep, commandHistory, clearInput
  );

  command.executeSetupCommand(setup.val());

  lesson.on('prompt', function(event) {
    command.logPrompt(event);
  });

  lesson.on('execute', function(event) {
    command.executeLessonCommand(event);
  })

  lesson.doStep();
  input.on('keyup', function(event) {
    if (event.which === ENTER) command.executeUserCommand(input.val());
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
  // TODO: should lesson be reset?
  function resetDb() {
    db.close();
    db = new SQL.Database();
    command.executeSetupCommand(setup.val());
  }
}
