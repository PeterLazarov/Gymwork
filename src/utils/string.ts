export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const alphabeticNumbering = (index: number) => String.fromCharCode(65 + index)

export const searchString = (
  string: string,
  filterCondition: (word: string) => boolean,
): boolean => {
  const filterWords = string.toLowerCase().split(" ").filter(Boolean)

  return filterWords.every(filterCondition)
}

export const decamelize = (
  str: string,
  options?: { preserveConsecutiveUppercase?: boolean; separator?: string },
): string => {
  const separator = options?.separator ?? "-"
  const preserveConsecutiveUppercase = options?.preserveConsecutiveUppercase ?? false

  if (preserveConsecutiveUppercase) {
    // Handle consecutive uppercase letters specially
    return str
      .replace(/([A-Z]+)([A-Z][a-z])/g, `$1${separator}$2`)
      .replace(/([a-z\d])([A-Z])/g, `$1${separator}$2`)
      .toLowerCase()
  }

  return str.replace(/([a-z\d])([A-Z])/g, `$1${separator}$2`).toLowerCase()
}
