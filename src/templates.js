'use strict';

function tag(tagName, attributes) {
  return function tagInstance(content) {
    let attrStr = '';
    if (typeof attributes === 'object') {
      const keys = Object.keys(attributes);
      attrStr = keys.map(key => `${key}=${attributes[key]}`).join(' ');
    }
    return `<${tagName} ${attrStr}>${content}</${tagName}>`;
  };
}

exports.commandTemplate = tag('li', { class: 'command' });
exports.errorTemplate = tag('li', { class: 'error' });
exports.promptTemplate = tag('li', { class: 'prompt' });

exports.resultsTemplate = function resultsTemplate(results) {
  const headers = tag('tr')(results.columns.map(tag('th')).join(''));
  const rows = results.values.map(record =>
    tag('tr')(record.map(tag('td')).join(''))
  );
  return tag('li')(tag('table')(headers + rows.join('')));
};
