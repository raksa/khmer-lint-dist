/**
 * `khmer-lint/node` — the Node side of `khmer-lint`: the dictionaries this
 * package ships, read from disk, and a ready-made linter over them.
 */
export { createKhmerLinter, createNodeKhmerSpellcheckEngine, getKhmerDictionaryDir, loadDictionaryFromFiles, } from '../../../src/khmer-lint/node.js';
export type { KhmerLinter, KhmerLinterOptions, NodeDictionaryConfig, } from '../../../src/khmer-lint/node.js';
