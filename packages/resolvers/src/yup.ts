import { AnySchema } from 'yup'

export const yupResolver = <T>(schema: AnySchema<T>) => schema.validateSync
