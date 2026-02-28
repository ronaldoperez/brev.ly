import { api } from '../lib/axios'

export interface Url {
  id: string
  originalUrl: string
  shortCode: string
  clicks: number
}

export async function getAllUrls() {
  const response = await api.get<Url[]>('/urls')
  return response.data
}
