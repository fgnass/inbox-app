var webFrame = require('electron').webFrame;
var Spellchecker = require('spellchecker').Spellchecker;

var checker = new Spellchecker();
var langs = checker.getAvailableDictionaries().slice(0, 2);

webFrame.setSpellCheckProvider('en', false, {
  spellCheck: function(word) {
    return langs.some(function(lang) {
      // Using multiple instances does not work, we have to swap the dictionary:
      checker.setDictionary(lang);
      return !checker.isMisspelled(word);
    });
  }
});
