var fs = require('fs');
var electron = require('electron');
var app = electron.app;

var badge = require('./badge');
var inbox = require('./inbox');
var menu = require('./menu');

app.on('ready', function() {
  var win = inbox.open('https://inbox.google.com');

  win.on('close', function() {
    fs.writeFileSync(inbox.getBoundsFile(), JSON.stringify({
      bounds: win.getBounds()
    }));
  });

  menu();
  badge();
});
