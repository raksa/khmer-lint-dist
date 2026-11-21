/**
 * Re-split every Khmer run in `text` with `segment` (a run → its words joined
 * by ZWSP, or `''` to keep it) — the same pass as the web editor's
 * "Try Khmer Segmentation" (`applyTranscriptWordSegmentation`).
 */
declare function segmentKhmerText(text: string, segment: (word: string) => Promise<string>): Promise<string>;
/**
 * Visible/soft whitespace typed between Khmer letters → the zero-width word
 * separator: the web editor's paste/Format repair (`wordSeparatorPattern`).
 */
declare function normalizeKhmerWordSeparators(text: string): string;
export { normalizeKhmerWordSeparators, segmentKhmerText };
