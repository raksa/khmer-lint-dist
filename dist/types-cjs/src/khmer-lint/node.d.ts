import { type KhmerLintIssue, type KhmerLintOptions } from './linter.js';
import type { KhmerSpellcheckEngine } from './spellcheck-engine.js';
/**
 * The folder holding the Khmer dictionaries (`km_KH.aff`, `km_KH.dic`,
 * `km_KH-suggest.aff`): the `dics/` beside this module or one of its parent
 * folders — `dist/dics/` in the published package, `src/khmer-lint/dics/` in
 * the source tree, or wherever a host that bundles this module copies them.
 */
declare function getKhmerDictionaryDir(): string;
interface KhmerLinterOptions {
    /**
     * A folder with `km_KH.aff`, `km_KH.dic` (and `km_KH-suggest.aff` for
     * suggestions). Default: the dictionaries this package ships.
     */
    dictionaryDir?: string;
    /** Load the suggestion affix file. Default true. */
    suggestions?: boolean;
    /** Words accepted whatever the dictionary says (added to later). */
    customWords?: Iterable<string>;
}
interface KhmerLinter {
    /** The spellcheck engine underneath. */
    readonly engine: KhmerSpellcheckEngine;
    /** The folder the dictionaries are read from. */
    readonly dictionaryDir: string;
    /** Words accepted whatever the dictionary says; add to it freely. */
    readonly customWords: Set<string>;
    /** Resolves once the dictionaries are loaded; rejects when they cannot be. */
    ready(): Promise<void>;
    /** Lint text — the default rules unless `rules` chooses. */
    lint(text: string, options?: Omit<KhmerLintOptions, 'spellchecker' | 'customWords'>): Promise<KhmerLintIssue[]>;
    /** Each word → correctly spelled (custom words always are). */
    checkWords(words: readonly string[]): Promise<Record<string, boolean>>;
    /** Replacements for a word, best first. */
    suggest(word: string, limit?: number): Promise<string[]>;
    /**
     * A run split at the dictionary words it contains (joined by zero-width
     * spaces; an unknown stretch stays one piece), or `''`.
     */
    segment(word: string): Promise<string>;
    /** Every Khmer run of a text split as {@link KhmerLinter.segment} splits it. */
    segmentText(text: string): Promise<string>;
}
/**
 * A Khmer linter over the dictionaries on disk. They load in the background
 * from the call on (a second or two); every method waits for them.
 */
declare function createKhmerLinter({ dictionaryDir, suggestions, customWords, }?: KhmerLinterOptions): KhmerLinter;
export { createNodeKhmerSpellcheckEngine, loadDictionaryFromFiles, } from './node-engine.js';
export type { NodeDictionaryConfig } from './node-engine.js';
export { createKhmerLinter, getKhmerDictionaryDir };
export type { KhmerLinter, KhmerLinterOptions };
