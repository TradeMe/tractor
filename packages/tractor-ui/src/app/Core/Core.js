'use strict';

// Utilities:
var angular = window.angular;

var Core = angular.module('Core', []);

module.exports = Core;

require('./Directives/KeyboardEvents');

require('./Components/Action/ActionDirective');
require('./Components/Autocomplete/AutocompleteDirective');
require('./Components/Checkbox/CheckboxDirective');
require('./Components/ConfirmDialog/ConfirmDialogDirective');
require('./Components/DragFile/DragFileDirective');
require('./Components/DropFile/DropFileDirective');
require('./Components/FileTree/FileTreeDirective');
require('./Components/GiveFocus/GiveFocusDirective');
require('./Components/LiteralInput/LiteralInputDirective');
require('./Components/Notifier/NotifierDirective');
require('./Components/PanelHandle/PanelHandleDirective');
require('./Components/SelectInput/SelectInputDirective');
require('./Components/Submit/SubmitDirective');
require('./Components/TextInput/TextInputDirective');
require('./Components/VariableInput/VariableInputDirective');

require('./Services/ASTCompareService');
require('./Services/ASTCreatorService');
require('./Services/ConfirmDialogService');
require('./Services/FileEditorService');
require('./Services/FileStructureService');
require('./Services/HttpResponseInterceptor');
require('./Services/PersistentStateService');
require('./Services/RealtimeService');
require('./Services/RedirectionService');
require('./Services/SearchService');
require('./Services/StringToLiteralService');
require('./Services/ValidationService');

require('./Validators/FileNameValidator');
require('./Validators/VariableNameValidator');
