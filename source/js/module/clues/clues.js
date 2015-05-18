/**
 * @module:   clues
 * @scss:     ./source/css/module/clues.scss
 * @html:     ./source/js/module/clues/clues.html
 */


var Module = require('../abstract-module');

var ordinal = require('mout/number/ordinal')

    module.exports = Module.extend({

    template: require('./clues.html'),

    data: function () {
        return {
            hintsOn: false,
            ordinal: function (n) {
                return ordinal(n);
            },
            clues: [
              {
                  clue: "An easy one to start - take the first letter from a nearby alliterative station. (Any other alliterative stations you can think of?)",
                  letter: 1,
                  answer: "Charing Cross",
                  hint: "It's so close! Alliterative means the same letter at the start of each word."
              },
              {
                  clue: "Down on Northumberland Street you’ll find someone who might be able to help (at least with this clue) - although he’s a bit far from his usual floury haunt.",
                  letter: 4,
                  answer: "Sherlock Holmes",
                  hint: "Floury as in flour, used by Bakers - and consulting detectives"
              }
            ]
        }
    },

    oninit: function () {

        // generate array of letters from answer
        var clues = this.get("clues");
        for (key in clues) {
            var ans = clues[key].answer;
            this.set(`clues[${key}].letters`, this.generateLetterArray(ans));
        }
    },

    onrender: function () {

        this.on("keyUp", this.onLetterInput.bind(this));
    },

    generateLetterArray: function(ans) {

        var arr = ans.toLowerCase().replace(/\W/g, "/").split("");
        return arr;
    },

    onLetterInput: function (e) {

        var input = e.node,
            key = e.original.keyCode;
        if (input.value.length == input.maxLength) {
            var next = input.nextElementSibling;
            if (next && next.tagName.toLowerCase() == "input" && !next.readOnly) {
                next.focus();
            }
        } else if (input.value.length == 0 && key == 8 || key == 46) {
            var prev = input.previousSibling;
            if (prev && prev.tagName.toLowerCase() == "input" && !prev.readOnly) {
                prev.focus();
            }
        }
    }

});
