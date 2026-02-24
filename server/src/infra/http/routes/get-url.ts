import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/app/functions/errors/resource-not-found'
import { getUrl } from '@/app/functions/get-url'
import { isRight, unwrapEither } from '@/shared/either'

export const getUrlRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/urls/:id',
    {
      schema: {
        tags: ['urls'],
        summary: 'Get a url',
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z
            .object({
              originalUrl: z.string().describe('Url to be redirected to'),
            })
            .describe('Link to redirection'),
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
          404: z.object({ message: z.string() }).describe('Url not found'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const result = await getUrl({ id })

      if (isRight(result)) {
        const { originalUrl } = unwrapEither(result)
        return reply.status(200).send({ originalUrl })
      }

      const error = unwrapEither(result)
      if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({ message: 'Não encontrado.' })
      }
    }
  )
}
