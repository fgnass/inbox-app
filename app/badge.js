var electron = require('electron');
var app = electron.app;
var NativeImage = electron.nativeImage;
var BrowserWindow = electron.BrowserWindow;
var ipc = electron.ipcMain;

function setBadge(text) {
  if (app.dock) {
    app.dock.setBadge('' + text);
  } 
  else if (process.platform === 'win32') {
    if (text === '') {
      BrowserWindow.getAllWindows().forEach(function(win) {
        win.setOverlayIcon(null, '');
      });
      return;
    }
    
    var wc = BrowserWindow.getAllWindows()[0].webContents;
    if (!wc) {
      // window shutting down 
      return;
    }

    wc.executeJavaScript('window.createBadge("'+text+'");', function(badgeDataURL) {
      var img = NativeImage.createFromDataURL(badgeDataURL);
      
      BrowserWindow.getAllWindows().forEach(function(win) {
        win.setOverlayIcon(img, text);
      });
    });
  }
}

var badgeValue = 0;

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
      var prev = badgeValue;
      var total = getTotal();
      if (total == prev) {
        return;
      }
      
      badgeValue = total;
      if(total == 0) {
        setBadge('');
        return;
      }

      setBadge('' + total);
      if (total > prev && app.dock) {
        app.dock.bounce('informational');
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

  ipc.on('update-icon', function(event, data) {
    var win = BrowserWindow.fromWebContents(event.sender);
    var img = NativeImage.createFromDataUrl(data.url);

    win.setOverlayIcon(img, data.text);
  });

  app.on('will-quit', function() {
    setBadge('');
  });

  app.on('activate', function() {
    var win = getLatestMessageWindow();
    if (win) win.show();
  });
};
