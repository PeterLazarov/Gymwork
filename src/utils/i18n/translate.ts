import i18n, { TxKeyPath } from "./i18n"

/**
 * Translates text.
 * @param {TxKeyPath} key - The i18n key.
 * @param {any} options - The i18n options.
 * @returns {string} - The translated text.
 * @example
 * Translations:
 *
 * ```en.ts
 * {
 *  "hello": "Hello, {{name}}!"
 * }
 * ```
 *
 * Usage:
 * ```ts
 * import { translate } from "i18n-js"
 *
 * translate("common.ok", { name: "world" })
 * // => "Hello world!"
 * ```
 */
export function translate(key: TxKeyPath, options?: any): string {
  return i18n.t(key, options) as string
}
