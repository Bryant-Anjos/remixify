import { z } from 'zod'

export const zodResolver = <T>(schema: z.ZodType<T>) => schema.parse
