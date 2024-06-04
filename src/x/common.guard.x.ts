export const is_equal = function <T>(
  _: unknown,
  {a, b}: {a: T; b: T},
) {
  return a === b
}
