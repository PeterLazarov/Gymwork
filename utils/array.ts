export const groupBy = <T extends object>(array: T[], field: keyof T) => {
  return array.reduce(
    (grouped, item: T) => {
      let groupValues: string[]
      if (Array.isArray(item[field])) {
        groupValues = (item[field] as any[]).map(value => `${value}`)
      } else {
        groupValues = [`${item[field]}`]
      }

      groupValues.forEach(groupValue => {
        grouped[groupValue] = grouped[groupValue] || []
        grouped[groupValue].push(item)
      })

      return grouped
    },
    {} as Record<string, T[]>
  )
}
