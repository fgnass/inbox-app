var fs = require('fs');
var path = require('path');
var URL = require('url');

var dir = path.resolve(__dirname, '..');

module.exports = function(win) {
  var wc = win.webContents;
  wc.on('did-navigate', function(ev, url) {
    var host = URL.parse(url).host;
    if (host == 'inbox.google.com') {
      wc.insertCSS(fs.readFileSync(dir + '/web/custom.css', 'utf8'));
      wc.executeJavaScript('module.paths.push("' + dir + '/node_modules");');
      wc.executeJavaScript('module.paths.push("' + dir + '/web");');
      wc.executeJavaScript('require("inject");');
    }
  });
};
