const succ = (n: number): number => {
  return n + 1
}

const prev = (n: number): number => {
  return n - 1
}

export const add = (x: number, y: number): number => {
  return y < 1 ? x : add(succ(x), prev(y))
}