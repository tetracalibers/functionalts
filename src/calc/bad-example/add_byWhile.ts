const add_byWhile: Function = (x: number, y: number) => {
  while (y > 0) {
    x = x + 1
    y = y - 1
  }
  return x
}

console.log(add_byWhile(3, 2))