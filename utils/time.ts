// able to group by a nested value of a singular object or by an array of primitice values
export const getFormatedDuration = (totalSeconds: number) => {
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds}`
}
