/*{"name":"file","elements":[{"name":"name"}],"actions":[{"name":"get name","parameters":[]}],"version":"1.4.0"}*/
module.exports = function () {
    var File = function File(host) {
        var find = host ? host.element.bind(host) : element;
        this.name = find(by.css('main form.file .file-options__name'));
    };
    File.prototype.getName = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.name.getText();
        });
        return result;
    };
    return File;
}();