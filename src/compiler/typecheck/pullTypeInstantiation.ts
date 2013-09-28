///<reference path="..\typescript.ts" />

module TypeScript {
    export class PullInitializedType extends PullTypeSymbol {

        // TODO: on parent
        public isInitialized(): boolean {
            return true;
        }

        // TODO: move type arguments here

        public isGeneric(): boolean {
            return true;
        }

        public isOpenType: boolean = false;
    }

    export class PullInitializedSignatureSymbol extends PullSignatureSymbol {
    }
}