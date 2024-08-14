// able to group by a nested value of a singular object or by an array of primitice values
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  field: string
) => {
  return array.reduce((grouped: Record<string, T[]>, item: T) => {
    const nestedKeys = (field as string).split('.') // Split the field by dot for nested properties
    let groupValue: string | number

    // Traverse nested properties
    if (nestedKeys.length > 1) {
      let nestedValue: typeof item | undefined = item
      for (const key of nestedKeys) {
        if (
          nestedValue &&
          typeof nestedValue === 'object' &&
          key in nestedValue
        ) {
          nestedValue = nestedValue[key]
        } else {
          nestedValue = undefined
          break
        }
      }

      groupValue = nestedValue !== undefined ? `${nestedValue}` : ''
    } else {
      // Handle non-nested field
      if (Array.isArray(item[field])) {
        groupValue = (item[field] as any[]).map(value => `${value}`).join('_')
      } else {
        groupValue = `${item[field]}`
      }
    }

    grouped[groupValue] = grouped[groupValue] || []
    grouped[groupValue].push(item)

    return grouped
  }, {} as Record<string, T[]>)
}

export const uniqueValues = (arr: any[]) => {
  return [...new Set(arr)]
}
