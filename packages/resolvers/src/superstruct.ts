import { assert, Struct } from 'superstruct'

export const joiResolver =
  <T>(schema: Struct<T, Error>) =>
  (value: unknown) =>
    assert(value, schema)
