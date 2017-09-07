'use strict';

// Angular:
import { NgModule } from '@angular/core';

// Modules:
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Dependencies:
import { ASTService } from './ast/ast.service';
import { ButtonComponent } from './button/button.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { ConfirmService } from './confirm/confirm.service';
import { DragFileDirective } from './file-tree/drag-file/drag-file.directive';
import { DropFileDirective } from './file-tree/drop-file/drop-file.directive';
import { FileEditorComponent } from './file-editor/file-editor.component';
import { FileOptionsComponent } from './file-options/file-options.component';
import { FileStructureService } from './file-structure/file-structure.service';
import { FileTreeActionsComponent } from './file-tree/file-tree-actions/file-tree-actions.component';
import { FileTreeDirectoryComponent } from './file-tree/file-tree-directory/file-tree-directory.component';
import { FileTreeRenameComponent } from './file-tree/file-tree-rename/file-tree-rename.component';
import { FileTreeComponent } from './file-tree/file-tree.component';
import { FileTypesService } from './file-types/file-types.service';
import { FocusOnDirective } from './file-tree/focus-on/focus-on.directive';
import { InputComponent } from './input/input.component';
import { PersistentStateService } from './persistent-state/persistent-state.service';
import { SelectComponent } from './select/select.component';
import { StringToLiteralService } from './string-to-literal/string-to-literal.service';
import { SubmitComponent } from './submit/submit.component';


@NgModule({
    declarations: [
        ButtonComponent,
        ConfirmComponent,
        DragFileDirective,
        DropFileDirective,
        FileEditorComponent,
        FileOptionsComponent,
        FileTreeActionsComponent,
        FileTreeDirectoryComponent,
        FileTreeRenameComponent,
        FileTreeComponent,
        FocusOnDirective,
        InputComponent,
        SelectComponent,
        SubmitComponent
    ],
    exports: [
        ButtonComponent,
        ConfirmComponent,
        FileEditorComponent,
        FileOptionsComponent,
        FileTreeComponent,
        InputComponent,
        SelectComponent,
        SubmitComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    providers: [
        ASTService,
        ConfirmService,
        FileStructureService,
        FileTypesService,
        PersistentStateService,
        StringToLiteralService
    ],
})
export class SharedModule { }
