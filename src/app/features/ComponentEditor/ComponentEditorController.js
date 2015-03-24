'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('./ComponentEditor');

// Dependencies:
require('./Services/ComponentFileService');
require('./Services/ComponentParserService');
require('./Models/ComponentModel');

var ComponentEditorController = (function () {
    var ComponentEditorController = function ComponentEditorController (
        $scope,
        $window,
        NotifierService,
        ComponentFileService,
        ComponentParserService,
        ComponentModel,
        componentFileStructure,
        componentFile
    ) {
        this.$scope = $scope;
        this.$window = $window;
        this.notifierService = NotifierService;

        this.componentFileService = ComponentFileService;
        this.componentParserService = ComponentParserService;

        this.fileStructure = componentFileStructure;

        if (componentFile) {
            parseComponentFile.call(this, componentFile);
        } else {
            this.component = new ComponentModel();
            this.component.addElement();
            this.component.addAction();
        }
    };

    ComponentEditorController.prototype.saveComponentFile = function () {
        var ast = this.component.ast;
        var name = this.component.name;

        var exists = fileAlreadyExists(name, this.fileStructure);

        if (!exists || this.$window.confirm('This will overwrite "' + name + '". Continue?')) {
            this.componentFileService.saveComponentFile(ast, name)
            .then(function () {
                this.component.isSaved = true;
                return this.componentFileService.getComponentFileStructure();
            }.bind(this))
            .then(function (componentFileStructure) {
                this.fileStructure = componentFileStructure;
            }.bind(this));
        }
    };

    ComponentEditorController.prototype.showErrors = function () {
        var componentEditor = this.$scope['component-editor'];
        if (componentEditor.$invalid) {
            Object.keys(componentEditor.$error).forEach(function (invalidType) {
                var errors = componentEditor.$error[invalidType];
                errors.forEach(function (element) {
                    element.$setTouched();
                });
            });
            this.notifierService.error('Can\'t save component, something is invalid.');
        }
        return componentEditor.$valid;
    };

    function parseComponentFile (componentFile) {
        this.component = this.componentParserService.parse(componentFile.ast);
    }

    function fileAlreadyExists (fileName, directory) {
        return _.some(directory, function (info, name) {
            if (info['-type'] === 'd') {
                // Directory:
                return fileAlreadyExists(fileName, info);
            } else if (name !== '-type' && name !== '-path') {
                // File:
                return new RegExp(fileName + '\.').test(name);
            }
        });
    }

    return ComponentEditorController;
})();

ComponentEditor.controller('ComponentEditorController', ComponentEditorController);
