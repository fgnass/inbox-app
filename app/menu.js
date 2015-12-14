var electron = require('electron');
var Menu = electron.Menu;

module.exports = function(win) {
  var template = [{
    label: 'Inbox',
    submenu: [
      { label: 'Quit', accelerator: 'Command+Q', click: function() { electron.app.quit(); }},
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
};
