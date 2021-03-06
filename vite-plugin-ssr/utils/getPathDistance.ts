import { assert } from './assert'

export { getPathDistance }

function getPathDistance(pathA: string, pathB: string): number {
  assert(pathA.startsWith('/'))
  assert(pathB.startsWith('/'))
  assert(!pathA.startsWith('\\'))
  assert(!pathB.startsWith('\\'))

  let charIdx = 0
  for (; charIdx < pathA.length && charIdx < pathB.length; charIdx++) {
    if (pathA[charIdx] !== pathB[charIdx]) break
  }

  const pathAWithoutCommon = pathA.slice(charIdx)
  const pathBWithoutCommon = pathB.slice(charIdx)

  const distanceA = pathAWithoutCommon.split('/').length
  const distanceB = pathBWithoutCommon.split('/').length

  const distance = distanceA + distanceB

  return distance
}
