const is_obj = (
  obj: unknown,
): obj is object =>
  (obj ?? false)?.constructor
    ?.name === 'Object'

const is_obj_with_keys = <
  K extends readonly string[],
>(
  obj: unknown,
  keys: K,
): obj is Record<
  K[number],
  unknown
> => {
  if (!is_obj(obj))
    return false
  return keys.every(
    key => key in obj,
  )
}
