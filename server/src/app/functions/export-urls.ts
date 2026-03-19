import { PassThrough, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { stringify } from 'csv-stringify'
import { ilike } from 'drizzle-orm'
import { z } from 'zod'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import type { Either } from '@/shared/either'
import { makeRight } from '@/shared/either'

const exportUrlsInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(['createdAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
})

type ExportUrlsInput = z.input<typeof exportUrlsInput>

type ExportUrlsOutput = {
  reportUrl: string
}

export async function exportUrls(
  input: ExportUrlsInput
): Promise<Either<never, ExportUrlsOutput>> {
  const { searchQuery } = exportUrlsInput.parse(input)

  const { sql, params } = db

    .select({
      originalUrl: schema.urls.originalUrl,
      shortCode: schema.urls.shortCode,
      clicks: schema.urls.clicks,
      createdAt: schema.urls.createdAt,
    })
    .from(schema.urls)
    .where(
      searchQuery
        ? ilike(schema.urls.originalUrl, `%${searchQuery}%`)
        : undefined
    )
    .toSQL()

  const cursor = pg.unsafe(sql, params as string[]).cursor(2)

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'original_url', header: 'URL original' },
      { key: 'short_code', header: 'URL encurtada' },
      { key: 'clicks', header: 'Contagem de acessos' },
      { key: 'created_at', header: 'Data de criacao' },
    ],
  })

  const uploadToStorageStream = new PassThrough()

  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk)
        }

        callback()
      },
    }),
    csv,
    uploadToStorageStream
  )

  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: `${new Date().toISOString()}-urls.csv`,
    contentStream: uploadToStorageStream,
  })

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline])

  return makeRight({ reportUrl: url })
}
