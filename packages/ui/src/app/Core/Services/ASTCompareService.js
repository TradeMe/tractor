'use strict';

// Module:
var Core = require('../Core');

// Dependencies:
var Diff = require('text-diff');
var escodegen = require('escodegen');

var ASTCompareService = function () {
    var diff = new Diff();
    return { compare };

    function compare (a, b) {
        if (a == null || b == null) {
            return false;
        }
        
        var jsA = escodegen.generate(a);
        var jsB = escodegen.generate(b);
        var difference = diff.main(jsA, jsB);
        var isTheSame = diff.levenshtein(difference) === 0;

        /* eslint-disable */
        if (!isTheSame && window.__tractor__ && window.__tractor__.debug) {
            diff.cleanupSemantic(difference);
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.innerHTML = diff.prettyHtml(difference);
            pre.appendChild(code);
            document.body.appendChild(pre);
            const app = document.querySelector('body > [ui-view]');
            app.parentNode.removeChild(app);
        }
        /* eslint-enable */

        return isTheSame;
    }
};

Core.service('astCompareService', ASTCompareService);
