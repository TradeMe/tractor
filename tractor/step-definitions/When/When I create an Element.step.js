/*{
    "name": "When I create an Element",
    "components": [
        {
            "name": "Element creator"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var ElementCreator = require('../../components/Component Editor/Element creator.component.js'), elementCreator = new ElementCreator();
    this.When(/^I create an Element$/, function (done) {
        var tasks = elementCreator.createElementModel('Element', 'element.model');
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};
