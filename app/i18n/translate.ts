import decamelize from 'decamelize'
import i18n from 'i18next'
import type { TOptions } from 'i18next'

import { capitalize } from '@/utils/string'

import { TxKeyPath } from './i18n'

export const nestingHackKey = 'nestingHack'

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
  const fixedKey = `${nestingHackKey}:${key}`

  if (i18n.isInitialized) {
    if (i18n.exists(fixedKey, options)) return i18n.t(fixedKey, options)

    console.warn(`Missing Translation: ${key}`)

    return capitalize(
      decamelize(key, { preserveConsecutiveUppercase: true, separator: ' ' })
    )
  }
  return key
}
