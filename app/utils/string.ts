export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const alphabeticNumbering = (index: number) =>
  String.fromCharCode(65 + index)
