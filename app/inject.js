var fs = require('fs');
var path = require('path');
var URL = require('url');
var platform = require('platform');

var dir = path.resolve(__dirname, '..');

module.exports = function(win) {
  var wc = win.webContents;
  wc.on('did-navigate', function(ev, url) {
    var host = URL.parse(url).host;
    if (host == 'inbox.google.com') {
      insertCss(wc);
      this.once('did-finish-load', function() {
        wc.executeJavaScript('module.paths.push("' + dir + '/node_modules");');
        wc.executeJavaScript('module.paths.push("' + dir + '/web");');
        wc.executeJavaScript('require("inject");');
      });
    }
  });

  function insertCss(wc) {
    wc.insertCSS(fs.readFileSync(dir + '/web/css/custom.css', 'utf8'));
    try {
      var customCss = 'custom-' + platform.os.family.replace(/\s/, '').toLowerCase() + '.css';
      wc.insertCSS(fs.readFileSync(dir + '/web/css/' + customCss, 'utf8'));
      console.log('Using specific styles: ' + customCss);
    } catch (e) {}
  }
};
