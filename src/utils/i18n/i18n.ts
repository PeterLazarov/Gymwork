import * as Localization from "expo-localization"
import { I18n } from "i18n-js"
import { I18nManager } from "react-native"

import { capitalize, decamelize } from "../string"
import en, { Translations } from "./en"

const translations = { en, "en-US": en }

const i18n = new I18n(translations)

i18n.enableFallback = true
i18n.defaultLocale = "en-US"

const originalTranslate = i18n.t.bind(i18n)
const customTranslate = <T = string>(
  scope: string | readonly string[],
  options?: any,
): string | T => {
  const result = originalTranslate(scope, { ...options, missingBehavior: "guess" })

  let scopeString: string
  if (Array.isArray(scope)) {
    scopeString = scope.join(".")
  } else {
    scopeString = scope as string
  }

  if (typeof result === "string" && result.startsWith("[missing")) {
    console.warn(`Missing Translation: ${scopeString}`)
    return capitalize(
      decamelize(scopeString, { preserveConsecutiveUppercase: true, separator: " " }),
    ) as T
  }

  return result
}
i18n.t = customTranslate

const fallbackLocale = "en-US"
const systemLocale = Localization.getLocales()[0]
const systemLocaleTag = systemLocale?.languageTag ?? "en-US"

const availableTranslations = Object.keys(translations)

if (availableTranslations.includes(systemLocaleTag)) {
  i18n.locale = systemLocaleTag
} else {
  const generalLocale = systemLocaleTag.split("-")[0]
  if (availableTranslations.includes(generalLocale)) {
    i18n.locale = generalLocale
  } else {
    i18n.locale = fallbackLocale
  }
}

export const isRTL = systemLocale?.textDirection === "rtl"
I18nManager.allowRTL(isRTL)
I18nManager.forceRTL(isRTL)

export type TxKeyPath = RecursiveKeyOf<Translations>

type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`>
}[keyof TObj & (string | number)]

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `['${TKey}']` | `.${TKey}`
  >
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValue<TValue, Text extends string> = TValue extends any[]
  ? Text
  : TValue extends object
    ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
    : Text

export default i18n