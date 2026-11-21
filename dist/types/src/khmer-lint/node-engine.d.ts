import { type TypoDictionary, type TypoDictionaryConfig } from '../editor/scripts/typo-dictionary.js';
import { type KhmerSpellcheckEngine } from './spellcheck-engine.js';
/**
 * The Khmer spellcheck engine with a file-system dictionary loader: in Node a
 * dictionary config's `affUrl` / `dicUrl` are file paths, read from disk,
 * instead of URLs to fetch.
 */
/** A dictionary config whose `affUrl` / `dicUrl` are file paths. */
type NodeDictionaryConfig = TypoDictionaryConfig;
declare function loadDictionaryFromFiles(config: NodeDictionaryConfig): Promise<TypoDictionary>;
declare function createNodeKhmerSpellcheckEngine(): KhmerSpellcheckEngine;
export { createNodeKhmerSpellcheckEngine, loadDictionaryFromFiles };
export type { NodeDictionaryConfig };
