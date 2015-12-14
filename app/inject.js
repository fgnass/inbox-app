var fs = require('fs');
var path = require('path');

var dir = path.resolve(__dirname, '..');

module.exports = function(win) {
  win.once('page-title-updated', function() {
    var wc = win.webContents;
    wc.insertCSS(fs.readFileSync(dir + '/web/custom.css', 'utf8'));
    wc.executeJavaScript('module.paths.push("' + dir + '/node_modules");');
    wc.executeJavaScript('module.paths.push("' + dir + '/web");');
    wc.executeJavaScript('require("inject");');
  });
}
