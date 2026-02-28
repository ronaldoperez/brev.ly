import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { ResourceNotFoundError } from './errors/resource-not-found'

const getUrlByShortCodeInput = z.object({
  shortCode: z.string(),
})

type GetUrlByShortCodeInput = z.infer<typeof getUrlByShortCodeInput>

export async function getUrlByShortCode(
  input: GetUrlByShortCodeInput
): Promise<Either<ResourceNotFoundError, { originalUrl: string }>> {
  const { shortCode } = getUrlByShortCodeInput.parse(input)

  const url = await db.query.urls.findFirst({
    where(fields, { eq }) {
      return eq(fields.shortCode, shortCode)
    },
  })

  if (!url) {
    return makeLeft(new ResourceNotFoundError())
  }

  await db
    .update(schema.urls)
    .set({ clicks: url.clicks + 1 })
    .where(eq(schema.urls.shortCode, shortCode))
    .returning()

  return makeRight({ originalUrl: url.originalUrl })
}
