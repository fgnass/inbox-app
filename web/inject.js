var path = require('path');

['inspect', 'spellcheck', 'unread', 'accounts'].forEach(function(mod) {
  try {
    require(path.join(__dirname, mod));
  }
  catch (err) {
    console.log(err);
  }
});
