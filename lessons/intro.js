var prompt = require('./lesson-utils').prompt;
var command = require('./lesson-utils').command;
var pressEnter = require('./lesson-utils').pressEnter;
var checkResults = require('./lesson-utils').checkResults;
var lessonComplete = require('./lesson-utils').lessonComplete;

module.exports = [
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
