/**
 * Lint Khmer text: possible misspellings (with the spellcheck engine), runs of
 * repeated zero-width characters, and — opt-in — visible spaces between Khmer
 * letters. Environment-neutral — the caller supplies the spellchecker
 * (`createKhmerSpellcheckEngine`, or `createKhmerLinter` from
 * `khmer-lint/node`, which loads the bundled dictionaries).
 *
 * `word-separator` is not a default rule: Khmer prose puts a visible space
 * between phrases, so a space between Khmer letters is only a mistake in text
 * that marks every word break with a zero-width space (lyrics typed on NiDA,
 * text prepared for line breaking).
 */
type KhmerLintRule = 'spelling' | 'word-separator' | 'repeated-zero-width';
/** Every rule. */
declare const KHMER_LINT_RULES: readonly KhmerLintRule[];
/** The rules run when none are chosen: all but the opt-in `word-separator`. */
declare const KHMER_LINT_DEFAULT_RULES: readonly KhmerLintRule[];
interface KhmerLintIssue {
    rule: KhmerLintRule;
    severity: 'warning' | 'information';
    message: string;
    /** 0-based line. */
    line: number;
    /** 0-based UTF-16 column of the first character. */
    start: number;
    /** 0-based UTF-16 column just past the last character. */
    end: number;
    /** The text the issue covers. */
    text: string;
    /**
     * Replacements for `text`, best first. Spelling: the dictionary's
     * suggestions (possibly none). Word separator: a zero-width space.
     * Repeated zero-width: the run's first character.
     */
    replacements: string[];
    /**
     * Spelling, for a run of several words written together: the parts the
     * dictionary does not know — where the mistake is. Absent when the run
     * does not split, or with `maxSuggestions: 0`.
     */
    unknownParts?: string[];
}
/** The part of a spellcheck engine the linter uses. */
interface KhmerLintSpellchecker {
    checkWords(words: readonly string[]): Promise<Record<string, boolean>>;
    suggestWord?(word: string, limit?: number): Promise<string[]>;
    segmentWord?(word: string): Promise<string>;
}
interface KhmerLintOptions {
    /** Spellcheck with this engine; without one, the `spelling` rule finds nothing. */
    spellchecker?: KhmerLintSpellchecker | null;
    /** Words accepted whatever the dictionary says. */
    customWords?: Iterable<string>;
    /** The rules to run. Default: {@link KHMER_LINT_DEFAULT_RULES}. */
    rules?: readonly KhmerLintRule[];
    /** Suggestions per misspelling; 0 skips suggestions and segmentation. Default 3. */
    maxSuggestions?: number;
    /** Stop after this many issues. Default 1000. */
    maxIssues?: number;
}
/** Every issue the chosen rules find, in document order. */
declare function lintKhmerText(text: string, { spellchecker, customWords, rules, maxSuggestions, maxIssues, }?: KhmerLintOptions): Promise<KhmerLintIssue[]>;
/**
 * Apply each issue's first replacement, back to front so earlier ranges stay
 * valid. Issues without a replacement, and any overlapping one already
 * applied, are skipped.
 */
declare function applyKhmerLintFixes(text: string, issues: readonly KhmerLintIssue[]): {
    text: string;
    applied: number;
};
export { applyKhmerLintFixes, KHMER_LINT_DEFAULT_RULES, KHMER_LINT_RULES, lintKhmerText, };
export type { KhmerLintIssue, KhmerLintOptions, KhmerLintRule, KhmerLintSpellchecker, };
