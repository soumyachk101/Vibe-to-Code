export async function parseJSON(raw: string): Promise<unknown> {
  // Strip markdown code blocks if present
  const cleaned = raw
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    // Brute-force: extract first { to last }
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No JSON object found')
    return JSON.parse(cleaned.slice(start, end + 1))
  }
}
