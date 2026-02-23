import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createUrl } from '@/app/functions/create-url'
import { createUrlSchema } from '@/app/functions/create-url.schema'
import { ResourceAlreadyExistsError } from '@/app/functions/errors/resource-already-exists'
import { isRight, unwrapEither } from '@/shared/either'

export const createUrlRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/urls',
    {
      schema: {
        tags: ['urls'],
        summary: 'Create a new url',
        body: createUrlSchema,
        response: {
          201: z
            .object({
              originalUrl: z.string(),
              shortCode: z.string(),
              clicks: z.number(),
            })
            .describe('URL created successfully'),
          400: z
            .object({
              message: z.string(),
              issues: z.array(
                z.object({
                  field: z.string(),
                  message: z.string(),
                })
              ),
            })
            .describe('Validation error'),
          409: z
            .object({ message: z.string() })
            .describe('Resource already exists'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortCode } = request.body

      const result = await createUrl({ originalUrl, shortCode })

      if (isRight(result)) {
        const { url } = unwrapEither(result)
        return reply.status(201).send(url)
      }

      const error = unwrapEither(result)
      if (error instanceof ResourceAlreadyExistsError) {
        return reply.status(409).send({ message: 'URL encurtada já existe' })
      }
    }
  )
}
