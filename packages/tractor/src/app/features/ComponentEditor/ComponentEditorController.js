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
        $window,
        ComponentFileService,
        ComponentParserService,
        ComponentModel,
        componentFileNames
    ) {
        this.$window = $window;
        this.componentFileService = ComponentFileService;
        this.componentParserService = ComponentParserService;
        this.componentFileNames = componentFileNames;

        this.component = new ComponentModel();
        this.component.addElement();
        this.component.addAction();
    };

    ComponentEditorController.prototype.openComponentFile = function (componentFileName) {
        var open = this.component.name === componentFileName;

        if (!open) {
            this.componentFileService.openComponentFile(componentFileName)
            .then(_.bind(function (data) {
                try {
                    this.component = this.componentParserService.parse(data.ast);
                } catch (e) { }
            }, this));
        }
    };

    ComponentEditorController.prototype.saveComponentFile = function () {
        var componentFileNames = this.componentFileNames;
        var ast = this.component.ast;
        var name = this.component.name;

        var exists = _.contains(componentFileNames, name);

        if (!exists || exists && this.$window.confirm('This will overwrite "' + name + '". Continue?')) {
            this.componentFileService.saveComponentFile(ast, name)
            .then(function () {
                if (!exists) {
                    componentFileNames.push(name);
                }
            });
        }
    };

    return ComponentEditorController;
})();

ComponentEditor.controller('ComponentEditorController', ComponentEditorController);
