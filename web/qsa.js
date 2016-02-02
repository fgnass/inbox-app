module.exports = function qsa(sel) {
  return Array.prototype.slice.call(document.querySelectorAll(sel));
};
