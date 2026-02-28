import { api } from '../lib/axios'

interface GetUrlResponse {
  originalUrl: string
}

export async function getUrl(shortCode: string) {
  const response = await api.get<GetUrlResponse>(`/urls/shortcode/${shortCode}`)
  return response.data
}
