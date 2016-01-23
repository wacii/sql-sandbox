'use strict';

module.exports = function(currentStep, nextStep) {
  return function enterPressed(command) {
    const step = currentStep();
    if (step == null || step.type !== 'pressEnter') return command;
    nextStep();
    return command;
  };
};
