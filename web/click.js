function createEvent(type) {
  return new MouseEvent(type, {
    'view': window,
    'bubbles': true,
    'cancelable': true
  });
}

module.exports = function(el) {
  el.dispatchEvent(createEvent('mousedown'));
  el.dispatchEvent(createEvent('click'));
};
