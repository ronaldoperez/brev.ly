import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { ResourceNotFoundError } from './errors/resource-not-found'

const deleteUrlInput = z.object({
  id: z.string(),
})

type DeleteUrlInput = z.infer<typeof deleteUrlInput>

export async function deleteUrl(
  input: DeleteUrlInput
): Promise<Either<ResourceNotFoundError, { id: string }>> {
  const { id } = deleteUrlInput.parse(input)

  const [url] = await db
    .delete(schema.urls)
    .where(eq(schema.urls.id, id))
    .returning({ id: schema.urls.id })

  if (!url) {
    return makeLeft(new ResourceNotFoundError())
  }

  return makeRight({ id: url.id })
}
