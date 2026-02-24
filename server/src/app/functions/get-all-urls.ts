import { desc, type InferSelectModel } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/shared/either'

type Url = InferSelectModel<typeof schema.urls>

export async function getAllUrls(): Promise<Either<never, { urls: Url[] }>> {
  const urls = await db
    .select()
    .from(schema.urls)
    .orderBy(desc(schema.urls.createdAt))
  return makeRight({ urls: urls ?? [] })
}
