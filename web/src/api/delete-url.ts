import { api } from '../lib/axios'

export async function deleteUrl(id: string) {
  await api.delete(`/urls/${id}`)
}
