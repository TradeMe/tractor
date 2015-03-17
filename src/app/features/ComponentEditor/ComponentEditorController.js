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
        componentFileNames,
        componentFile
    ) {
        this.$scope = $scope;
        this.$window = $window;
        this.notifierService = NotifierService;

        this.componentFileService = ComponentFileService;
        this.componentParserService = ComponentParserService;
        this.componentFileNames = componentFileNames;

        if (componentFile) {
            parseComponentFile.call(this, componentFile);
        } else {
            this.component = new ComponentModel();
            this.component.addElement();
            this.component.addAction();
        }
    };

    ComponentEditorController.prototype.saveComponentFile = function () {
        var componentFileNames = this.componentFileNames;
        var ast = this.component.ast;
        var name = this.component.name;

        var exists = _.contains(componentFileNames, name);

        if (!exists || this.$window.confirm('This will overwrite "' + name + '". Continue?')) {
            this.componentFileService.saveComponentFile(ast, name)
            .then(function () {
                if (!exists) {
                    componentFileNames.push(name);
                }
            });
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
            return false;
        } else {
            return true;
        }
    };

    function parseComponentFile (componentFile) {
        this.component = this.componentParserService.parse(componentFile.ast);
    }

    return ComponentEditorController;
})();

ComponentEditor.controller('ComponentEditorController', ComponentEditorController);
