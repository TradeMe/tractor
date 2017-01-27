/*{"name":"ComponentPage","elements":[{"name":"components page nav"},{"name":"components file tree header"}],"actions":[{"name":"click components page link","parameters":[]},{"name":"get Name","parameters":[]}]}*/
module.exports = function () {
    var ComponentPage = function ComponentPage() {
        this.componentsPageNav = element(by.linkText('Components'));
        this.componentsFileTreeHeader = element(by.css('h2.file-tree__header'));
    };
    ComponentPage.prototype.clickComponentsPageLink = function () {
        var self = this;
        return self.componentsPageNav.click();
    };
    ComponentPage.prototype.getName = function () {
        var self = this;
        return self.componentsFileTreeHeader.getText();
    };
    return ComponentPage;
}();