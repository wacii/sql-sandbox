'use strict';

// constants
const ENTER = 13;
const UP = 38;
const DOWN = 40;
const push = Array.prototype.push;
const slice = Array.prototype.slice;
const splice = Array.prototype.splice;

const CommandHistory = require('./command-history');
const Lesson = require('./lesson');
const commandBuilder = require('./commands');
const intro = require('../lessons/intro');

window.sqlSandbox = { init: init };

function init() {
  // TODO: attach this to an element, and create the framework from a template

  // textarea containing sql commands run when db is initialized
  const setup = $('#setup')
  // list of previously run sql commands and their results/errors
  const log = $('#log');
  // input user enters in sql commands to be run
  const input = $('#input');
  // clears log, input, and restores the db with setup code
  const reset = $('#reset');

  function clearInput() {
    input.val('');
  }
  function clearLog() {
    log.empty();
  }

  const lesson = new Lesson('Intro');
  lesson.steps = intro;
  const currentStep = lesson.currentStep.bind(lesson);
  const nextStep = lesson.nextStep.bind(lesson);

  const commandHistory = new CommandHistory(input);
  const db = new SQL.Database();

  // TODO: pass lesson not bound lesson methods
  const command = commandBuilder(
    db, log, currentStep, nextStep, commandHistory, clearInput
  );

  command.executeSetupCommand(setup.val());

  lesson.on('prompt', command.logPrompt);
  lesson.on('execute', command.executeLessonCommand);

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
