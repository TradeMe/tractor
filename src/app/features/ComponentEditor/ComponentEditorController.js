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
        componentFolderStructure,
        componentFile
    ) {
        this.$scope = $scope;
        this.$window = $window;
        this.notifierService = NotifierService;

        this.componentFileService = ComponentFileService;
        this.componentParserService = ComponentParserService;

        this.folderStructure = componentFolderStructure;

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

        var exists = componentAlreadyExists.call(this, name);

        if (!exists || this.$window.confirm('This will overwrite "' + name + '". Continue?')) {
            this.componentFileService.saveComponentFile(ast, name)
            .then(function () {
                return this.componentFileService.getComponentFolderStructure();
            }.bind(this))
            .then(function (componentFolderStructure) {
                this.folderStructure = componentFolderStructure;
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

    function componentAlreadyExists (componentName, directory) {
        return _.some(directory || this.componentFolderStructure, function (info, name) {
            // Directory:
            if (info['-type'] === 'd') {
                return componentAlreadyExists.call(this, componentName, info);
            // File:
            } else if (name !== '-type' && name !== '-path') {
                return new RegExp(componentName).test(name);
            }
        });
    }

    return ComponentEditorController;
})();

ComponentEditor.controller('ComponentEditorController', ComponentEditorController);
