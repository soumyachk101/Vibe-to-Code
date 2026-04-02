import axios from 'axios'

export const client = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } })

export async function generateAPI(data: { vibe: string; tags?: string[]; theme?: string; industry?: string }) {
  const res = await client.post('/generate', data)
  return res.data.data
}

export async function exportAPI(system: unknown, format: string) {
  const res = await client.post('/export', { design_system: system, format })
  return res.data.data
}
