/**
 * Where the Khmer words of a plain document are — every run of Khmer text (by
 * `KHMER_WORD_RE`) that holds at least one Khmer letter, with its 0-based
 * line and UTF-16 columns. Nothing else in the document is looked at.
 */
interface KhmerWordOccurrence {
    word: string;
    /** 0-based line. */
    line: number;
    /** 0-based UTF-16 column of the first character. */
    start: number;
    /** 0-based UTF-16 column just past the last character. */
    end: number;
}
declare function findKhmerWords(text: string): KhmerWordOccurrence[];
export { findKhmerWords };
export type { KhmerWordOccurrence };
