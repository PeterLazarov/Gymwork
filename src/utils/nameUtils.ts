export function getDayTimeLabel(timestamp: number) {
  const d = new Date(timestamp)
  const h = d.getHours()

  if (h < 6) return "Night"
  if (h < 12) return "Morning"
  if (h < 17) return "Afternoon"
  if (h < 21) return "Evening"
  return "Night"
}
