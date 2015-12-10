var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var fs = require('fs');
var ipc = require('ipc');
var Menu = require('menu');
var shell = require('shell');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var win = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});

app.on('browser-window-created', function() {
  console.log('browser-window-created', arguments);
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {

  // Create the browser window.
  win = new BrowserWindow({
    width: 1024,
    height: 768
  });

  var template = [{
    label: 'Inbox',
    submenu: [
      { label: 'Quit', accelerator: 'Command+Q', click: function() { app.quit(); }},
      { label: 'Developer Tools', accelerator: 'Command+Alt+J', click: function() { win.openDevTools(); }}
    ]}, {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
      { label: 'Paste and match style', accelerator: 'Command+Shift+V', selector: 'pasteAndMatchStyle:' },
      { label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' }
    ]}
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  var wc = win.webContents;

  wc.on('new-window', function(ev, url, name) {
    //TODO Gmail uses window.open('?parm=value') which currently
    //does not work in electron. Hence we prevent the default for
    //al kinds of URLs.
    ev.preventDefault();
    if (url[0] != '?') {
      // Open external URLs in the default browser
      shell.openExternal(url);
    }

  });

  win.loadUrl('https://inbox.google.com');

  var prevCount;
  ipc.on('unread', function(event, count) {
    if (count > 0) {
      app.dock.setBadge(count);
      if (count > prevCount) app.dock.bounce('informational');
    }
    else {
      app.dock.setBadge('');
    }
    prevCount = count;
  });

  wc.on('dom-ready', function() {
    wc.insertCSS(fs.readFileSync(__dirname + '/inject.css', 'utf8'));
    wc.executeJavaScript(fs.readFileSync(__dirname + '/inject.js', 'utf8'));
  });

  // Emitted when the window is closed.
  win.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
    app.dock.setBadge('');
  });
});
