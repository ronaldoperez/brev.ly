import { z } from 'zod'

export const createUrlSchema = z.object({
  originalUrl: z.string().url({
    message: 'URL inválida',
  }),
  shortCode: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: 'A URL encurtada deve conter apenas letras, números e hífens.',
    })
    .min(3, {
      message: 'A URL encurtada deve ter no mínimo 3 caracteres.',
    }),
})

export type CreateUrlInput = z.infer<typeof createUrlSchema>
