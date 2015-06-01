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
            var nextTag = next ? next.tagName.toLowerCase() : null;

            // input is next
            if (next && nextTag == "input" && !next.readOnly) {
                return next.focus();
            }

            // space is next
            if (next && nextTag == "span" && next.classList.contains("clue__space")) {
                return next.nextElementSibling.focus();
            }
        } else if (input.value.length == 0 && key == 8 || key == 46) {
            var prev = input.previousSibling;
            var prevTag = prev ? prev.tagName.toLowerCase() : null;

            // input is next
            if (prev && prevTag == "input" && !prev.readOnly) {
                return prev.focus();
            }

            // space is next
            if (prev && prevTag == "span" && prev.classList.contains("clue__space")) {
                return prev.previousSibling.focus();
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
