/*{"name":"When I overwrite a Component","components":[{"name":"Component header"},{"name":"Confirm dialog"}],"mockData":[]}*/
module.exports = function () {
    var ComponentHeader = require('../../components/Component Editor/Component header.component.js'), componentHeader = new ComponentHeader();
    var ConfirmDialog = require('../../components/Confirm dialog.component.js'), confirmDialog = new ConfirmDialog();
    this.When(/^I overwrite a Component$/, function (done) {
        var tasks = componentHeader.save().then(function () {
            return confirmDialog.confirm();
        });
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};
