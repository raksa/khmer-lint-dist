import type { KhmerSpellcheckInitializePayload } from './spellcheck-engine.js';
/**
 * The engine's `initialize` payload for the Khmer dictionaries in a folder —
 * `km_KH.aff` + `km_KH.dic`, and `km_KH-suggest.aff` for suggestions. Kept
 * apart from the engine, so a host can build it without loading typo-js (the
 * VS Code extension host builds it; only its worker threads load the engine).
 */
/** The dictionary files `khmer-lint` ships, by role. */
declare const KHMER_DICTIONARY_FILES: {
    readonly aff: "km_KH.aff";
    readonly dic: "km_KH.dic";
    readonly suggestAff: "km_KH-suggest.aff";
};
declare function createKhmerInitializePayload(dicsDir: string, withSuggestions: boolean): KhmerSpellcheckInitializePayload;
export { createKhmerInitializePayload, KHMER_DICTIONARY_FILES };
