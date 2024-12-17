import i18n from 'i18next'
import type { TOptions } from 'i18next'
import { TxKeyPath } from './i18n'
import { capitalize } from '@/utils/string'
import decamelize from 'decamelize'

/**
 * Translates text.
 * @param {TxKeyPath} key - The i18n key.
 * @param {TOptions} options - The i18n options.
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
 * import { translate } from "./i18n"
 *
 * translate("common:ok", { name: "world" })
 * // => "Hello world!"
 * ```
 */
export function translate(key: TxKeyPath, options?: TOptions): string {
  if (i18n.isInitialized) {
    if (i18n.exists(key, options)) return i18n.t(key, options)

    console.warn(`Missing Translation: ${key}`)

    return capitalize(
      decamelize(key, { preserveConsecutiveUppercase: true, separator: ' ' })
    )
  }
  return key
}
