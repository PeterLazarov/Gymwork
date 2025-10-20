export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  
  export const alphabeticNumbering = (index: number) =>
    String.fromCharCode(65 + index)
  
  export const searchString = (
    string: string,
    filterCondition: (word: string) => boolean
  ): boolean => {
    const filterWords = string.toLowerCase().split(' ').filter(Boolean)
  
    return filterWords.every(filterCondition)
  }
  