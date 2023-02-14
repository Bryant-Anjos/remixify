import { AnySchema } from 'joi'

export const joiResolver = <T>(schema: AnySchema<T>) => schema.validate
