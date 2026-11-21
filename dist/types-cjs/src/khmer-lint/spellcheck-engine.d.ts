import { type TypoDictionary, type TypoDictionaryConfig } from '../editor/scripts/typo-dictionary.js';
type KhmerDictionaryLoader = (dictionaryConfig: TypoDictionaryConfig) => Promise<TypoDictionary | null>;
interface KhmerSpellcheckEngineOptions {
    /** Build a dictionary from its config. Default: fetch both URLs. */
    loadDictionary?: KhmerDictionaryLoader;
}
/** The `initialize` request's payload. */
interface KhmerSpellcheckInitializePayload {
    /** The dictionary to check against. */
    dictionaryConfig?: TypoDictionaryConfig | null;
    /** A dictionary already loaded elsewhere, as `createDictionarySnapshot` made it. */
    dictionaryData?: unknown;
    /**
     * Dictionaries suggestions are drawn from instead of the main one — the
     * same word list with a richer affix file, say.
     */
    suggestDictionaryConfigs?: TypoDictionaryConfig[];
    suggestDictionaryConfig?: TypoDictionaryConfig;
}
type KhmerSpellcheckRequest = {
    id?: unknown;
    type: 'initialize';
    payload?: KhmerSpellcheckInitializePayload;
} | {
    id?: unknown;
    type: 'checkWords';
    payload?: {
        words?: string[];
    };
} | {
    id?: unknown;
    type: 'segment';
    payload?: {
        word?: string;
    };
} | {
    id?: unknown;
    type: 'suggest';
    payload?: {
        word?: string;
        limit?: number;
    };
} | {
    id?: unknown;
    type: 'complete';
    payload?: {
        prefix?: string;
        limit?: number;
    };
} | {
    id?: unknown;
    type?: string;
    payload?: Record<string, unknown>;
};
interface KhmerSpellcheckResponse {
    id?: unknown;
    /**
     * `initialize`: `{ ready }`; `checkWords`: word → correct; `segment`: the
     * words joined by zero-width spaces, or `''`; `suggest`: replacements;
     * `complete`: dictionary words that start with the prefix.
     */
    result?: unknown;
    error?: string;
}
interface KhmerSpellcheckEngine {
    /** Answer one protocol request; never rejects (errors come back as `error`). */
    handleMessage(message: KhmerSpellcheckRequest): Promise<KhmerSpellcheckResponse>;
    /**
     * Load the dictionaries (once; later calls only add a config they were
     * missing). Resolves `false` when the dictionary cannot be loaded.
     */
    initialize(payload?: KhmerSpellcheckInitializePayload): Promise<boolean>;
    /**
     * Each word → whether it is spelled correctly. An unspaced run of several
     * dictionary words is correct; a word with no Khmer letter is never wrong;
     * before the dictionary is loaded, everything is.
     */
    checkWords(words: readonly string[]): Promise<Record<string, boolean>>;
    /**
     * An unspaced run split at the dictionary words it contains, joined by
     * zero-width spaces — a stretch the dictionary does not know stays one
     * piece. `''` when the run is itself a dictionary word or does not split.
     */
    segmentWord(word: string): Promise<string>;
    /**
     * Up to `limit` (default 3) suggestions for a misspelled run; none for a
     * run of dictionary words.
     */
    suggestWord(word: string, limit?: number): Promise<string[]>;
    /**
     * Up to `limit` (default 8) dictionary words that start with `prefix`,
     * shortest first — word completion, not correction. None for a prefix with
     * no Khmer letter.
     */
    completeWord(prefix: string, limit?: number): Promise<string[]>;
}
declare function createKhmerSpellcheckEngine({ loadDictionary, }?: KhmerSpellcheckEngineOptions): KhmerSpellcheckEngine;
export { createKhmerSpellcheckEngine };
export type { KhmerDictionaryLoader, KhmerSpellcheckEngine, KhmerSpellcheckEngineOptions, KhmerSpellcheckInitializePayload, KhmerSpellcheckRequest, KhmerSpellcheckResponse, };
