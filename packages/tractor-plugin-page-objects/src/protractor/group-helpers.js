export function addGroupHelpers () {
    let { ElementArrayFinder } = global.protractor;

    ElementArrayFinder.prototype.getFromGroup = function (groupSelector) {
        let isFirst = groupSelector === 'first';
        let isLast = groupSelector === 'last';
        if (isFirst) {
            return this.first();
        }
        if (isLast) {
            return this.last();
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
