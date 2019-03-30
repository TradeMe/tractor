declare module "monkeypatch" {
    export = monkeypatch;

    type AnyFunction = (...args: any[]) => any;
    type FunctionPropertyNames<T> = {
        [K in keyof T]: T[K] extends AnyFunction ? K : never 
    }[keyof T];

    type IsDefinitelyFunction<MaybeFunction> = MaybeFunction extends AnyFunction ? MaybeFunction : never;

    function monkeypatch <
        PatchObject,
        PatchFunctionName extends FunctionPropertyNames<PatchObject>
    > (
        object: PatchObject,
        key: PatchFunctionName,
        patch: monkeypatch.MonkeypatchFunction<PatchObject, PatchFunctionName>
    ): void;

    namespace monkeypatch {
        export type MonkeypatchFunction <
            PatchObject,
            PatchObjectFunctionNames extends FunctionPropertyNames<PatchObject> = FunctionPropertyNames<PatchObject>
        > = (
            this: PatchObject,
            original: PatchObject[PatchObjectFunctionNames],
            ...args: Parameters<IsDefinitelyFunction<PatchObject[PatchObjectFunctionNames]>>
        ) => ReturnType<IsDefinitelyFunction<PatchObject[PatchObjectFunctionNames]>>;

        export type MonkeypatchedFunction<T> = T & {
            unpatch (): void
        };
    }
}
