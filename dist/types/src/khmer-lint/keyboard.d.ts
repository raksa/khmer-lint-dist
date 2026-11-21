import { type KhmerKeyLayer } from './keyboard-layout.js';
/**
 * Conversions between the Khmer NiDA layout (`keyboard-layout.ts`) and a US
 * QWERTY keyboard: text typed with the wrong layout active, in either
 * direction, and the keystrokes that type a Khmer text.
 */
/** What a US QWERTY keyboard types on each key: plain, and with Shift. */
declare const US_QWERTY_LAYOUT: Readonly<Record<string, readonly [string, string]>>;
/** One keystroke on the NiDA layout. */
interface NidaKeystroke {
    /** The text the keystroke types. */
    text: string;
    /** The physical key, as `KeyboardEvent.code` (`KeyK`, `Digit1`, `Space`). */
    code: string;
    layer: KhmerKeyLayer;
    /** How to press it, e.g. `K`, `Shift+K`, `Alt+Shift+1` (Alt is Option on a Mac). */
    label: string;
    /** What the same keystroke types on US QWERTY — absent for the Alt layers. */
    qwerty?: string;
}
/** A piece of text no NiDA keystroke types. */
interface UntypeableText {
    text: string;
    code: null;
}
/**
 * Text typed on a US keyboard while meaning the NiDA layout → the Khmer it
 * would have typed: each character is read as the key (and Shift state) that
 * types it on US QWERTY, and replaced with that key's NiDA character — e.g.
 * `xjmEr` → `ខ្មែរ`. A space is the key that types the zero-width word break
 * on NiDA, so it becomes one. Characters no US key types (line breaks, other
 * scripts, Khmer already) and keys whose NiDA layer is empty are kept.
 */
declare function convertQwertyToKhmer(text: string): string;
/**
 * The keystrokes that type `text` on the NiDA layout, in order. Where keys
 * overlap (`ុះ` is one Shift key, and also `ុ` + `ះ`), the longest output wins;
 * among keys typing the same text, the one with fewer modifiers. Text no key
 * types comes back with `code: null`.
 */
declare function getNidaKeystrokes(text: string): Array<NidaKeystroke | UntypeableText>;
/**
 * Khmer typed while meaning US QWERTY → the Latin text those keys type —
 * the reverse of {@link convertQwertyToKhmer}: `ខ្មែរ` → `xjmEr`. Text typed
 * on an Alt layer, and anything no NiDA key types, is kept.
 */
declare function convertKhmerToQwerty(text: string): string;
export { convertKhmerToQwerty, convertQwertyToKhmer, getNidaKeystrokes, US_QWERTY_LAYOUT, };
export type { NidaKeystroke, UntypeableText };
