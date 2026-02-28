import { api } from '../lib/axios'

interface ExportUrlsResponse {
  reportUrl: string
}

export async function exportUrls() {
  const response = await api.post<ExportUrlsResponse>('/urls/exports')
  return response.data
}
