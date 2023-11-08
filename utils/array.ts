export const groupBy = <T extends object>(array: T[], field: keyof T) => {
  return array.reduce(
    (grouped, x: T) => {
      const groupValue = `${x[field]}`
      grouped[groupValue] = grouped[groupValue] || []
      grouped[groupValue].push(x)
      return grouped
    },
    {} as Record<string, T[]>
  )
}
