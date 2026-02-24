import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { deleteUrl } from '@/app/functions/delete-url'
import { ResourceNotFoundError } from '@/app/functions/errors/resource-not-found'
import { isRight, unwrapEither } from '@/shared/either'

export const deleteUrlRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    '/urls/:id',
    {
      schema: {
        tags: ['urls'],
        summary: 'Delete a url',
        params: z.object({
          id: z.string(),
        }),
        response: {
          204: z.undefined().describe('Link deleted successfully'),
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
          404: z.object({ message: z.string() }).describe('Resource not found'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const result = await deleteUrl({ id })

      if (isRight(result)) {
        return reply.status(204).send()
      }

      const error = unwrapEither(result)
      if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({ message: 'Não encontrado.' })
      }
    }
  )
}
