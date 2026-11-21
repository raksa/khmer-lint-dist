type ToKhmerDigitsOptions = {
    /**
     * Leave the digits of non-Khmer text alone: a run of 0–9 whose nearest
     * letter on its line, before or after, is not Khmer belongs to that text —
     * `Bm7`, `Verse 1`, `Time: 4/4`, `70bpm`, `Psalm 23` — and stays as it is.
     * A number with only Khmer, or no letters at all, around it still converts.
     * Default false: every digit converts.
     */
    skipNonKhmerText?: boolean;
};
/**
 * Arabic digits 0–9 → Khmer digits ០–៩. Nothing else changes. With
 * `skipNonKhmerText`, digits that belong to Latin (or other non-Khmer) text
 * keep their Western form — see {@link ToKhmerDigitsOptions}.
 */
declare function toKhmerDigits(text: string, { skipNonKhmerText }?: ToKhmerDigitsOptions): string;
/** Khmer digits ០–៩ → Arabic digits 0–9. Nothing else changes. */
declare function toArabicDigits(text: string): string;
/**
 * Each run of two or more adjacent zero-width characters → its first one: the
 * Open Lyric editor's Format rule for repeated invisible characters, applied
 * to the three Khmer uses. A doubled word break carries no meaning and hides
 * in plain sight.
 */
declare function collapseZeroWidthRuns(text: string): string;
/**
 * Remove every zero-width space, ZWNJ and ZWJ — plain text for a system that
 * mishandles them. This loses the Khmer word breaks.
 */
declare function removeZeroWidthCharacters(text: string): string;
export { collapseZeroWidthRuns, removeZeroWidthCharacters, toArabicDigits, toKhmerDigits, };
export type { ToKhmerDigitsOptions };
