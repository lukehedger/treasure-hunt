/**
 * @module:   intro
 * @scss:     ./source/css/module/intro.scss
 * @html:     ./source/js/module/intro/intro.html
 */


var Module = require('../abstract-module');

module.exports = Module.extend({

  template: require('./intro.html'),

  transitions: {
      slide: require( 'ractive-transitions-slide' )
  },

  data: function () {
      return {
         visible: true
      }
  },

  oninit: function () {

      this.on("toggleIntro", function () {
          this.toggle("visible");
      });
  }

});
