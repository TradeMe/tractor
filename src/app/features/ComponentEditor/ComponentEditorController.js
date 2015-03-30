'use strict';

// Module:
var ComponentEditor = require('./ComponentEditor');

// Dependencies:
require('../Notifier/Services/NotifierService');
require('./Services/ComponentFileService');
require('./Models/ComponentModel');

var ComponentEditorController = (function () {
    var ComponentEditorController = function ComponentEditorController (
        $scope,
        $window,
        NotifierService,
        ComponentFileService,
        ComponentModel,
        componentFileStructure,
        componentPath
    ) {
        debugger;
        this.$scope = $scope;
        this.$window = $window;
        this.notifierService = NotifierService;
        this.componentFileService = ComponentFileService;

        this.fileStructure = componentFileStructure;

        if (componentPath) {
            this.component = this.componentFileService.openComponent(this.fileStructure, componentPath.path);
        }
        this.component = this.component || new ComponentModel();
    };

    ComponentEditorController.prototype.saveComponentFile = function () {
        this.componentFileService.getComponentPath({
            name: this.component.name,
            path: this.component.path
        })
        .then(function (componentPath) {
            var exists = this.componentFileService.checkComponentExists(this.fileStructure, componentPath.path);

            if (!exists || this.$window.confirm('This will overwrite "' + this.component.name + '". Continue?')) {
                this.componentFileService.saveComponent({
                    ast: this.component.ast,
                    name: this.component.name,
                    path: componentPath.path
                })
                .then(function () {
                    return this.componentFileService.getComponentFileStructure();
                }.bind(this))
                .then(function (componentFileStructure) {
                    this.fileStructure = componentFileStructure;
                    this.component = this.componentFileService.openComponent(this.fileStructure, componentPath.path);
                }.bind(this));
            }
        }.bind(this));
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

    return ComponentEditorController;
})();

ComponentEditor.controller('ComponentEditorController', ComponentEditorController);
