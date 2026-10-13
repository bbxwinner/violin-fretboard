// 小提琴把位（hand position）的规范定义：单一数据源，供 board 与 fifths 页面共用，
// 保证两处“把位”含义一致。行（row）= 该弦上的半音索引（0 = 空弦）。
export type HandPositionRange = { startRow: number; endRow: number }

export const HAND_POSITIONS: number[] = [1, 2, 3, 4, 5, 6, 7]

export const HAND_POSITION_RANGES: Record<number, HandPositionRange> = {
  1: { startRow: 0, endRow: 7 },
  2: { startRow: 3, endRow: 9 },
  3: { startRow: 5, endRow: 11 },
  4: { startRow: 7, endRow: 12 },
  5: { startRow: 8, endRow: 14 },
  // 第6把位（第1指在11半音）、第7把位（第1指在12半音/八度）：
  // 每把位相对上一把位上移2个半音，起点 8→10→12，与其余把位步进一致
  6: { startRow: 10, endRow: 17 },
  7: { startRow: 12, endRow: 19 },
}

export function getHandPositionRange(position: number): HandPositionRange | null {
  return HAND_POSITION_RANGES[position] ?? null
}

// 返回该把位覆盖的半音行（含首尾）。未知把位返回空数组。
export function getHandPositionRows(position: number): number[] {
  const range = HAND_POSITION_RANGES[position]
  if (!range) return []
  const rows: number[] = []
  for (let i = range.startRow; i <= range.endRow; i++) rows.push(i)
  return rows
}
