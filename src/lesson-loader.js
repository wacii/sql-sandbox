const Lesson = require('./lesson');

module.exports = class LessonLoader {
  constructor(db, terminal) {
    this.db = db;
    this.terminal = terminal;
  }

  load(data) {
    if (this.currentLesson) this.currentLesson.close();
    this.currentLesson = new Lesson(data, this.db, this.terminal);
    this.currentLesson.start();
    return this.currentLesson;
  }
};
