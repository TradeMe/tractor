declare module "esquery" {
    import { BaseNode } from 'estree';

    export = esquery;

    function esquery(ast: any, selector: string): Array<BaseNode>;
    namespace esquery { }
}
