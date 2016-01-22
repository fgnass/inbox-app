var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;

var inject = require('./inject');
var windows = require('./windows');

exports.open = function(url) {
  var win = new BrowserWindow({
    width: 1024,
    height: 768,
    'title-bar-style': 'hidden-inset'
  });

  inject(win);
  windows(win);

  win.loadURL(url);
  return win;
};
