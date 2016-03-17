var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipc = electron.ipcMain;

module.exports = function() {

  // Sum up the `unreadCount` property of all open windows
  function getTotal() {
    return BrowserWindow.getAllWindows().reduce(function(total, win) {
      return total + (win.unreadCount || 0);
    }, 0);
  }

  // Return the window where the last message was received
  function getLatestMessageWindow() {
    return BrowserWindow.getAllWindows()
      .filter(function(win) {
        return win.unreadCount;
      })
      .sort(function(a, b) {
        return a.lastUnreadTime > b.lastUnreadTime ? 1 : -1;
      })[0];
  }

  // Update the dock badge
  function update() {
    if (typeof app.dock !== "undefined") {
      var prev = app.dock.getBadge();
      var total = getTotal();
      if (total > 0) {
        app.dock.setBadge('' + total);
        if (total > prev) app.dock.bounce('informational');
      }
      else {
        app.dock.setBadge('');
      }
    }
  }

  // Update the `unreadCount` property of the sender's BrowserWindow
  ipc.on('unread', function(event, count) {
    var win = BrowserWindow.fromWebContents(event.sender);
    if (win.unreadCount === undefined) {
      win.on('close', update);
    }
    win.unreadCount = parseFloat(count);
    win.lastUnreadTime = Date.now();
    update();
  });

  app.on('will-quit', function() {
    if (typeof app.dock !== "undefined") {
      app.dock.setBadge('');
    }
  });

  app.on('activate', function() {
    var win = getLatestMessageWindow();
    if (win) win.show();
  });
};
