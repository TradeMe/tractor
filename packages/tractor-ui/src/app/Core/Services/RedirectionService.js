// Module:
var Core = require('../Core');

function RedirectionService ($state, fileTypes) {
    this.$state = $state;
    this.fileTypes = fileTypes;
}
RedirectionService.prototype.goToFile = function (file) {
    var fileType = this.fileTypes.find(function (fileType) {
        return file.url.endsWith(fileType.extension);
    });
    var type = fileType ? fileType.type : null;
    return this.$state.target('tractor.' + type, { file: file });
};

function RedirectionProvider () {
    var fileTypes = [];
    this.addFileType = function (extension, type) {
        fileTypes.push({ extension: extension, type: type });
    };

    this.$get = ['$state', function ($state) {
        return new RedirectionService($state, fileTypes);
    }];
}

Core.provider('redirectionService', RedirectionProvider);
