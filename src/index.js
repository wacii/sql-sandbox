// constants
const ENTER = 13;
const UP = 38;
const DOWN = 40;

const Lesson = require('./lesson');
const Terminal = require('./terminal');
const User = require('./user');
const Database = require('./database');

const $ = window.$; // FIXME

const init = function init() {
  // TODO: attach this to an element, and create the framework from a template

  // TODO: add setup, maybe just in sandbox mode
  // textarea containing sql commands run when db is initialized
  // const setup = $('#setup');
  // list of previously run sql commands and their results/errors
  const log = $('#log');
  // input user enters in sql commands to be run
  const input = $('#input');
  // clears log, input, and restores the db with setup code
  const reset = $('#reset');

  function clearInput() {
    input.val('');
  }

  const db = new Database();
  const terminal = new Terminal(log, db);
  const lesson = new Lesson(require('../lessons/1'), terminal, db);
  const user = new User(terminal);

  lesson.doStep();

  // TODO: consider interface to user and its relation to the input
  //   perhaps the object should have more responsibility
  //   or at the very least better expose command history
  input.on('keyup', event => {
    if (event.which === ENTER) {
      user.execute(input.val());
      input.empty();
    }
    else if (event.which === UP) user.commandHistory.back();
    else if (event.which === DOWN) user.commandHistory.forward();
  });

  reset.on('click', () => {
    clearInput();
    user.commandHistory.clear();
    db.reset();
  });
};

window.sqlSandbox = { init };
