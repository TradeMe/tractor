'use strict';

// Utilities:
var angular = require('angular');

var Core = angular.module('Core', []);

module.exports = Core;

require('./Components/Action/ActionDirective');
require('./Components/Checkbox/CheckboxDirective');
require('./Components/DragFile/DragFileDirective');
require('./Components/DropFile/DropFileDirective');
require('./Components/FileTree/FileTreeDirective');
require('./Components/GiveFocus/GiveFocusDirective');
require('./Components/LiteralInput/LiteralInputDirective');
require('./Components/Notifier/NotifierDirective');
require('./Components/ResizeHandle/ResizeHandleDirective');
require('./Components/SelectInput/SelectInputDirective');
require('./Components/StepInput/StepInputDirective');
require('./Components/Submit/SubmitDirective');
require('./Components/TextInput/TextInputDirective');
require('./Components/VariableInput/VariableInputDirective');

require('./Validators/VariableNameValidator');
require('./Validators/FileNameValidator');
require('./Validators/ExampleNameValidator');
