var URL = require('url');
var electron = require('electron');
var shell = electron.shell;

module.exports = function(win) {
  var wc = win.webContents;
  wc.on('new-window', function(ev, url, name) {
    var host = URL.parse(url).host;
    if (host != 'mail.google.com' && host != 'google-mail.com') {
      ev.preventDefault();
      shell.openExternal(url);
    }
  });
}
