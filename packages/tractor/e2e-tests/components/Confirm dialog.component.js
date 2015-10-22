/*{"name":"Confirm dialog","elements":[{"name":"okButton"},{"name":"cancelButton"}],"actions":[{"name":"ok","parameters":[]},{"name":"cancel","parameters":[]}]}*/
module.exports = function () {
    var ConfirmDialog = function ConfirmDialog() {
        this.okButton = element(by.css('tractor-action[action="ok"]'));
        this.cancelButton = element(by.css('tractor-action[action="cancel"]'));
    };
    ConfirmDialog.prototype.ok = function () {
        var self = this;
        return self.okButton.click();
    };
    ConfirmDialog.prototype.cancel = function () {
        var self = this;
        return self.cancelButton.click();
    };
    return ConfirmDialog;
}();