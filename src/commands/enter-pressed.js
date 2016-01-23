module.exports = function(currentStep, nextStep) {
  return function enterPressed(command) {
    var step = currentStep();
    if (step == null || step.type !== 'pressEnter') return command;
    nextStep();
    return command;
  };
};
