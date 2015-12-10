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
    console.log(url);

    //TODO create a new BrowserWindow for mail.google.com / google-mail.com links
    // i.e. links to attachments
    ev.preventDefault();
    shell.openExternal(url);

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
    wc.executeJavaScript('module.paths.push("' + __dirname + '/node_modules")');
    wc.executeJavaScript(fs.readFileSync(__dirname + '/inject.js', 'utf8'));
  });

  win.on('closed', function() {
    app.dock.setBadge('');
    app.quit();
  });
});
