/*{"name":"tractor-confirm-dialog","elements":[{"name":"ok button"},{"name":"cancel button"},{"name":"confirm message"}],"actions":[{"name":"get confirm message","parameters":[]},{"name":"ok","parameters":[]},{"name":"cancel","parameters":[]}],"version":"0.5.0"}*/
module.exports = function () {
    var TractorConfirmDialog = function TractorConfirmDialog(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        this.okButton = find(by.css('.dialog__wrapper tractor-action[action="Ok"] button'));
        this.cancelButton = find(by.css('.dialog__wrapper tractor-action[action="Cancel"] button'));
        this.confirmMessage = find(by.css('.dialog__wrapper .dialog__content p'));
    };
    TractorConfirmDialog.prototype.getConfirmMessage = function () {
        var self = this;
        var result;
        result = self.confirmMessage.getText();
        return result;
    };
    TractorConfirmDialog.prototype.ok = function () {
        var self = this;
        var result;
        result = self.okButton.click();
        return result;
    };
    TractorConfirmDialog.prototype.cancel = function () {
        var self = this;
        var result;
        result = self.cancelButton.click();
        return result;
    };
    return TractorConfirmDialog;
}();