var fs = require('fs');
var URL = require('url');
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipc = electron.ipcMain;
var Menu = electron.Menu;
var shell = electron.Shell;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {

  // Create the browser window.
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    'title-bar-style': 'hidden-inset'
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
    var host = URL.parse(url).host;
    if (host != 'mail.google.com' && host != 'google-mail.com') {
      ev.preventDefault();
      shell.openExternal(url);
    }
  });

  win.loadURL('https://inbox.google.com');

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

  app.on('will-quit', function() {
    app.dock.setBadge('');
  });

  win.once('page-title-updated', function() {
    wc.insertCSS(fs.readFileSync(__dirname + '/web/custom.css', 'utf8'));
    wc.executeJavaScript('module.paths.push("' + __dirname + '/node_modules");');
    wc.executeJavaScript('module.paths.push("' + __dirname + '/web");');
    wc.executeJavaScript('require("inject");');
  });

});
