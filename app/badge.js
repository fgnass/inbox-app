var electron = require('electron');
var app = electron.app;
var ipc = electron.ipcMain;

module.exports = function(win) {
  var wc = win.webContents;

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
};
