/// <reference path="./escodegen.d.ts" />

declare var estemplate: ESTemplateStatic;
declare module 'estemplate' {
    export = estemplate;
}

interface ESTemplateStatic {
    (template: string, objects): ESCodeGen.Program;
}

declare namespace ESTemplate {

}
