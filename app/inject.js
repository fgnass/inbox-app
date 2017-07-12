var fs = require('fs');
var path = require('path');
var URL = require('url');
var os = require('os');

var dir = path.resolve(__dirname, '..').replace(/\\/g, '/');

module.exports = function(win) {
  var wc = win.webContents;
  wc.on('dom-ready', function() {
    insertCss(wc);
  });
  wc.on('did-finish-load', function() {
    wc.executeJavaScript('module.paths.push("' + dir + '/node_modules");');
    wc.executeJavaScript('module.paths.push("' + dir + '/web");');
    wc.executeJavaScript('require("inject");');
  });

  function insertCss(wc) {
    wc.insertCSS(fs.readFileSync(dir + '/web/css/custom.css', 'utf8'));
    try {
      var customCss = 'custom-' + os.platform().replace(/\s/, '').toLowerCase() + '.css';
      wc.insertCSS(fs.readFileSync(dir + '/web/css/' + customCss, 'utf8'));
      console.log('Using specific styles: ' + customCss);
    }
    catch (e) {
      console.log(e);
    }
  }
};
