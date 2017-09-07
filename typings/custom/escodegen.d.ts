declare var escodegen: ESCodeGenStatic;
declare module 'escodegen' {
    export = escodegen;
}

interface ESCodeGenStatic {
    generate (ast: ESCodeGen.Node): string;
}

declare namespace ESCodeGen {
    interface Node {
        type: string;
        loc?: SourceLocation;
    }

    interface SourceLocation {
        source?: string;
        start: Position;
        end: Position;
    }

    interface Position {
        line: number;
        column: number;
    }

    interface Program extends Node {
        type: 'Program';
        body: Array<Statement>;
        comments: Array<BlockComment>;
    }

    interface Expression extends Node { }

    interface Statement extends Node { }

    interface BlockComment extends Node {
        type: 'Block';
        value: string;
    }

    interface ExpressionStatement extends Statement {
        type: 'ExpressionStatement';
        expression: Expression;
    }

    interface Identifier extends Expression {
        type: 'Identifier';
        name: string;
    }

    interface Literal extends Expression {
        type: 'Literal';
        value?: string | boolean | number | RegExp;
        raw?: string;
    }
}
