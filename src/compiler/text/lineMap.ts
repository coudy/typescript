///<reference path='references.ts' />

module TypeScript {
    export module LineMap1 {
        export function fromSimpleText(text: ISimpleText): LineMap {
            return new LineMap(() => TextUtilities.parseLineStarts(text), text.length());
        }

        export function fromScriptSnapshot(scriptSnapshot: IScriptSnapshot): LineMap {
            return new LineMap(() => scriptSnapshot.getLineStartPositions(), scriptSnapshot.getLength());
        }

        export function fromString(text: string): LineMap {
            return LineMap1.fromSimpleText(SimpleText.fromString(text));
        }
    }
}