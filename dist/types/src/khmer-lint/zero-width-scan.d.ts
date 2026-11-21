/**
 * Where the zero-width characters Khmer text uses are — the zero-width space
 * (U+200B, the Khmer word break), ZWNJ (U+200C) and ZWJ (U+200D) — grouped
 * into runs of adjacent ones, the way the Open Lyric web editor groups them
 * (`src/editor/scripts/invisible-characters.ts`): a single one is drawn as a
 * thin bar, two or more in a row as a warning box.
 */
/** Upper bound per document, so a pathological one can't stall the editor. */
export declare const MAX_ZERO_WIDTH_RUNS = 5000;
export interface ZeroWidthRun {
    /** 0-based line. */
    line: number;
    /** 0-based UTF-16 column of the first character. */
    start: number;
    /** 0-based UTF-16 column just past the last character. */
    end: number;
}
export declare function findZeroWidthRuns(text: string, maxRuns?: number): ZeroWidthRun[];
