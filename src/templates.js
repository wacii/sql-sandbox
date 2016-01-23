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
