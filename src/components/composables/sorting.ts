export const sortTable = (
  tableData: Record<string, any>[],
  criteria: string,
  inAscOrder: boolean
) => {
  tableData.sort((a, b) => {
    const aLower = a[criteria].toLowerCase()
    const bLower = b[criteria].toLowerCase()
    if (aLower < bLower) {
      return inAscOrder ? -1 : 1
    }
    if (aLower > bLower) {
      return inAscOrder ? 1 : -1
    }

    return 0
  })
}
