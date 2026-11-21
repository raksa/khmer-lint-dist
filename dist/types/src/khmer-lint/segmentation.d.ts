/**
 * Khmer word segmentation: split an unspaced run of Khmer text into words, by
 * longest dictionary match from the left — never splitting a letter from the
 * combining marks that follow it, keeping runs of a repeated character
 * together, and folding unmatched characters into the next segment until a
 * long valid word is found. The caller supplies the dictionary test, so this
 * module holds no dictionary of its own.
 */
/**
 * The words of an unspaced Khmer run, or `[]` when it does not split into at
 * least two segments that join back to exactly the input.
 */
declare function getKhmerSegmentationSegments(word: string, isValidWord: (segment: string) => boolean): string[];
export { getKhmerSegmentationSegments };
