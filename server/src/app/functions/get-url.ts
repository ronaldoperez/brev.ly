import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
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

  await db
    .update(schema.urls)
    .set({ clicks: url.clicks + 1 })
    .where(eq(schema.urls.id, id))
    .returning()

  return makeRight({ originalUrl: url.originalUrl })
}
