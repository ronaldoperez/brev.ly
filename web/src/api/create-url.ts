import { api } from '../lib/axios'

interface CreateUrlBody {
  originalUrl: string
  shortCode: string
}

export async function createUrl({ originalUrl, shortCode }: CreateUrlBody) {
  await api.post('/urls', {
    originalUrl,
    shortCode,
  })
}
