var fs = require('fs');
var path = require('path');
var electron = require('electron');

var BrowserWindow = electron.BrowserWindow;

var inject = require('./inject');
var windows = require('./windows');

var win;

function getUserId(url) {
  // The `authuser` parameter is present when switching profiles
  var m = url.match(/authuser=(\d)/);

  // ... otherwise the URLs look like this: `/u/<id>`
  if (!m) m = url.match(/\/u\/(\d)/);

  // ... or just `/` for the default user
  return m ? parseFloat(m[1]) : 0;
}

// Returns the window for the given user id
function getUserWindow(id) {
  var all = BrowserWindow.getAllWindows();
  for (var i = 0; i < all.length; i++) {
    var win = all[i];
    var url = win.webContents.getURL();
    if (getUserId(url) == id) return win;
  }
}

function getBrowserWindowBounds() {
  var data;
  try {
    data = JSON.parse(fs.readFileSync(exports.getBoundsFile(), 'utf8'));
  }
  catch (e) {
  }
  return (data && data.bounds) ? data.bounds : {
    width: 1024,
    height: 768
  };
}

// Return the main window bounds json file
exports.getBoundsFile = function() {
  return path.join(electron.app.getPath('userData'), 'init.json');
};

exports.open = function(url, name) {
  // look for an existing window
  var id = getUserId(url);
  var win = getUserWindow(id);
  if (win) {
    win.show();
    return win;
  }
  var windowBounds = getBrowserWindowBounds();
  win = new BrowserWindow({
    width: windowBounds.width,
    height: windowBounds.height,
    show: name != '_minimized',
    titleBarStyle: 'hidden-inset',
    icon: __dirname.split('/').slice(0, -1).join('/') + '/icon.iconset/icon_256x256.png'
  });

  if (name == '_minimized') win.minimize();

  inject(win);
  windows(win);

  win.loadURL(url);
  return win;
};
