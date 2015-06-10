/**
 * @module:   clues
 * @scss:     ./source/css/module/clues.scss
 * @html:     ./source/js/module/clues/clues.html
 */


var Module = require('../abstract-module');

var ordinal = require('mout/number/ordinal');
var set = require('mout/object/set');
var config = require('../../config');

module.exports = Module.extend({

    template: require('./clues.html'),

    data: function () {
        return {
            ordinal: function (n) {
                return ordinal(n);
            },
            clues: config.clues,
            storageKey: config.storageKey
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

        // if you want to clear...
        // this.removeLocalStorage(this.get("storageKey"));
    },

    onrender: function () {

        this.on("keyUp", this.onLetterInput.bind(this));

        this.checkStoredAnswers();
    },

    checkStoredAnswers: function () {

        var storedAnswers = this.getLocalStorage(this.get("storageKey"));
        for (var answer in storedAnswers) {
            // mark as solved if key letter is correct
            var correctLetterId = this.get(`clues[${answer}].letter`)-1,
                correctLetter = this.get(`clues[${answer}].letters[${correctLetterId}]`);
            if (correctLetter === storedAnswers[answer][correctLetterId]) this.set(`clues[${answer}].solved`, true);

            // fill inputs with stored letters
            var inputs = this.findAll(`input[data-clue-id='${answer}']`);
            if (inputs) this.fillInput(inputs, storedAnswers[answer]);
        }
    },

    generateLetterArray: function (ans) {

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

    fillInput: function (inputs, values) {
        for (var i = 0; i < inputs.length; i++) {
            var value = values[inputs[i].getAttribute('data-letter-id')];
            if (typeof value !== "undefined") inputs[i].value = value;
        }
    },

    checkInput: function (input) {
        var clueId = input.getAttribute("data-clue-id"),
            letterId = parseFloat(input.getAttribute("data-letter-id")),
            clue = this.get(`clues[${clueId}]`);

        // store input
        this.storeInput(clueId, letterId, input.value.toLowerCase());

        // is key letter?
        if (letterId+1 != clue.letter) return;

        // is solved?
        this.set(`clues[${clueId}].solved`, clue.letters[letterId] === input.value.toLowerCase() ? true : false);
    },

    storeInput: function (clueId, letterId, value) {
        var storedAnswers = this.getLocalStorage(this.get("storageKey")) || {};
        set(storedAnswers, `${clueId}.${letterId}`, value);
        this.setLocalStorage(this.get("storageKey"), storedAnswers);
    },

    getLocalStorage: function (keyName) {
        return JSON.parse(localStorage.getItem(keyName));
    },

    setLocalStorage: function (keyName, keyValue) {
        localStorage.setItem(keyName, JSON.stringify(keyValue));
    },

    removeLocalStorage: function (keyName) {
        localStorage.removeItem(keyName);
    }

});
