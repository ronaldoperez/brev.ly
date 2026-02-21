import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { exportUrls } from '@/app/functions/export-urls'
import { unwrapEither } from '@/shared/either'

export const exportUrlsRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/urls/exports',
    {
      schema: {
        summary: 'Export urls',
        tags: ['urls'],
        querystring: z.object({
          searchQuery: z.string().optional(),
        }),
        response: {
          200: z.object({
            reportUrl: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { searchQuery } = request.query
      const result = await exportUrls({
        searchQuery,
      })

      const { reportUrl } = unwrapEither(result)

      return reply.status(200).send({ reportUrl })
    }
  )
}
