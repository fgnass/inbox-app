var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var menu = require('./menu');
var inject = require('./inject');
var badge = require('./badge');
var windows = require('./windows');

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  var win = new BrowserWindow({
    width: 1024,
    height: 768,
    'title-bar-style': 'hidden-inset'
  });

  menu(win);
  inject(win);
  badge(win);
  windows(win);

  win.loadURL('https://inbox.google.com');
});
