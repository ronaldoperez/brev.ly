import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAllUrls } from '@/app/functions/get-all-urls'
import { unwrapEither } from '@/shared/either'

export const getAllUrlsRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/urls',
    {
      schema: {
        tags: ['urls'],
        summary: 'Get all urls',
        response: {
          200: z
            .array(
              z.object({
                id: z.string(),
                originalUrl: z.string(),
                shortCode: z.string(),
                clicks: z.number(),
              })
            )
            .describe('Urls list'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error'),
        },
      },
    },
    async (_request, reply) => {
      const result = await getAllUrls()

      const { urls } = unwrapEither(result)

      return reply.status(200).send(urls)
    }
  )
}
