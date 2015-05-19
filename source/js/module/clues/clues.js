/**
 * @module:   clues
 * @scss:     ./source/css/module/clues.scss
 * @html:     ./source/js/module/clues/clues.html
 */


var Module = require('../abstract-module');

var ordinal = require('mout/number/ordinal');
var config = require('../../config');

module.exports = Module.extend({

    template: require('./clues.html'),

    data: function () {
        return {
            hintsOn: false,
            ordinal: function (n) {
                return ordinal(n);
            },
            clues: config.clues
        }
    },

    oninit: function () {

        // generate array of letters from answer
        var clues = this.get("clues");
        for (key in clues) {
            var ans = clues[key].answer;
            this.set(`clues[${key}].letters`, this.generateLetterArray(ans));

            // unsolved by default
            this.set(`clues[${key}].solved`, false)
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

        // but is it right?
        this.checkInput(input);

        // move focus
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
    },

    checkInput: function (input) {
        var clueId = input.getAttribute("data-clue-id"),
            letterId = parseFloat(input.getAttribute("data-letter-id")),
            clue = this.get(`clues[${clueId}]`);

        if (letterId+1 != clue.letter) return;

        this.set(`clues[${clueId}].solved`, clue.letters[letterId] === input.value ? true : false);
    }

});
