/*{"name":"FeaturePage","elements":[{"name":"feature page nav"},{"name":"feature file tree header"},{"name":"run feature button"},{"name":"run feature button using partial text"}],"actions":[{"name":"select Feature Page link","parameters":[]},{"name":"select feature from feature tree","parameters":[]},{"name":"run feature button is present","parameters":[]},{"name":"run feature button by partial text is present","parameters":[]}]}*/
module.exports = function () {
    var FeaturePage = function FeaturePage() {
        this.featurePageNav = element(by.linkText('Features'));
        this.featureFileTreeHeader = element(by.css('p.file-tree__item-name.file-tree__item-none'));
        this.runFeatureButton = element(by.buttonText('Run feature'));
        this.runFeatureButtonUsingPartialText = element(by.partialButtonText('Run'));
    };
    FeaturePage.prototype.selectFeaturePageLink = function () {
        var self = this;
        return self.featurePageNav.click();
    };
    FeaturePage.prototype.selectFeatureFromFeatureTree = function () {
        var self = this;
        return self.featureFileTreeHeader.click();
    };
    FeaturePage.prototype.runFeatureButtonIsPresent = function () {
        var self = this;
        return self.runFeatureButton.isPresent();
    };
    FeaturePage.prototype.runFeatureButtonByPartialTextIsPresent = function () {
        var self = this;
        return self.runFeatureButtonUsingPartialText.isPresent();
    };
    return FeaturePage;
}();