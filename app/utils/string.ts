export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const alphabeticNumbering = (index: number) =>
  String.fromCharCode(65 + index)

export const searchString = (filterString: string, filterCondition: (word: string) => boolean) => {
  const filterWords = filterString
    .toLowerCase()
    .split(' ')
    .filter(Boolean)

  return filterWords.every(
    filterCondition
  )
}