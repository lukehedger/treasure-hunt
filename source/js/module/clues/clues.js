/**
 * @module:   clues
 * @scss:     ./source/css/module/clues.scss
 * @html:     ./source/js/module/clues/clues.html
 */


var Module = require('../abstract-module');

module.exports = Module.extend({

  template: require('./clues.html'),

  data: function () {
    return {
        hintsOn: false,
        clues: [
          {
              clue: "this is a clue",
              answer: "this is an answer",
              letters: function() {
                //  do something here? 
              },
              hint: "this is a hint"
          },
          {
              clue: "this is another clue",
              answer: "this is another answer",
              hint: "this is another hint"
          }
        ]
    };
  }

});
