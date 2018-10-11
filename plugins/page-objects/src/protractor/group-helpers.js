// Dependencies:
import { parseOrdinal } from './ordinals';

export function addGroupHelpers () {
    let { ElementArrayFinder } = global.protractor;

    ElementArrayFinder.prototype.getFromGroup = function (groupSelector) {
        let isLast = groupSelector === 'last';
        if (isLast) {
            return this.last();
        }

        let index = parseOrdinal(groupSelector);
        if (index) {
            return this.get(index - 1);
        }

        return this.filter((element, index) => {
            let content;
            return element.getText()
            .then(text => content = text)
            .then(() => element.getAttribute('textContent'))
            .then(textContent => content = textContent)
            .then(() => content.indexOf(groupSelector) >= 0 || index === +groupSelector);
        })
        .first();
    };
}
