import type { InferSelectModel } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { type CreateUrlInput, createUrlSchema } from './create-url.schema'
import { ResourceAlreadyExistsError } from './errors/resource-already-exists'

type Url = InferSelectModel<typeof schema.urls>

export async function createUrl(
  input: CreateUrlInput
): Promise<Either<ResourceAlreadyExistsError, { url: Url }>> {
  const { originalUrl, shortCode } = createUrlSchema.parse(input)

  const urlExists = await db.query.urls.findFirst({
    where(fields, { eq }) {
      return eq(fields.shortCode, shortCode)
    },
  })

  if (urlExists) {
    return makeLeft(new ResourceAlreadyExistsError())
  }

  const [url] = await db
    .insert(schema.urls)
    .values({
      originalUrl,
      shortCode,
    })
    .returning()

  return makeRight({ url })
}
