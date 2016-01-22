var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipc = electron.ipcMain;

module.exports = function() {

  var counters = new Map();

  function getTotal() {
    return Array.from(counters.values()).reduce(function(p, c) {
      return p + c;
    });
  }

  function update(win, count) {
    var prev = getTotal();
    counters.set(win.id, parseFloat(count));

    var total = getTotal();
    if (total > 0) {
      app.dock.setBadge('' + total);
      if (total > prev) app.dock.bounce('informational');
    }
    else {
      app.dock.setBadge('');
    }
  }

  ipc.on('unread', function(event, count) {
    var win = BrowserWindow.fromWebContents(event.sender);

    if (!counters.has(win.id)) {
      counters.set(win.id, 0);
      win.on('close', function() {
        update(win, 0);
      });
    }

    update(win, count);
  });

  app.on('will-quit', function() {
    app.dock.setBadge('');
  });
};
