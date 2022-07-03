const succ: Function = (n: number): number => {
  return n + 1
}

const prev: Function = (n: number): number => {
  return n - 1
}

const add: Function = (x: number, y: number): number => {
  return y < 1 ? x : add(succ(x), prev(y))
}

console.log(add(3, 2))