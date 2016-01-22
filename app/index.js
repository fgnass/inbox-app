var electron = require('electron');
var app = electron.app;

var badge = require('./badge');
var inbox = require('./inbox');
var menu = require('./menu');

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  var win = inbox.open('https://inbox.google.com');
  menu(win);
  badge();
});
