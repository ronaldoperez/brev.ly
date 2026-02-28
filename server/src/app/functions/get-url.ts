import { z } from 'zod'
import { db } from '@/infra/db'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { ResourceNotFoundError } from './errors/resource-not-found'

const getUrlInput = z.object({
  id: z.string(),
})

type GetUrlInput = z.infer<typeof getUrlInput>

export async function getUrl(
  input: GetUrlInput
): Promise<Either<ResourceNotFoundError, { originalUrl: string }>> {
  const { id } = getUrlInput.parse(input)

  const url = await db.query.urls.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, id)
    },
  })

  if (!url) {
    return makeLeft(new ResourceNotFoundError())
  }

  return makeRight({ originalUrl: url.originalUrl })
}
