'use strict';

module.exports = function buildEnterPressed(currentStep, nextStep) {
  return function enterPressed(command) {
    const step = currentStep();
    if (step === undefined || step.type !== 'pressEnter') return command;
    nextStep();
    return command;
  };
};
