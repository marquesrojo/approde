export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.APIFOOTBALL_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  const { date } = req.query
  if (!date) return res.status(400).json({ error: 'Missing date param (YYYY-MM-DD)' })

  try {
    const url = `https://v3.football.api-sports.io/fixtures?league=1&season=2026&date=${date}`
    const response = await fetch(url, {
      headers: { 'x-apisports-key': apiKey },
    })
    const data = await response.json()
    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(500).json({ error: 'API-Football error', details: data.errors })
    }

    // Simplificar la respuesta a lo esencial
    const fixtures = (data.response || []).map(f => ({
      home: f.teams?.home?.name,
      away: f.teams?.away?.name,
      homeGoals: f.goals?.home,
      awayGoals: f.goals?.away,
      status: f.fixture?.status?.short, // FT, NS, 1H, HT, 2H, etc.
      date: f.fixture?.date,
    }))

    res.status(200).json({ fixtures, remaining: response.headers.get('x-ratelimit-requests-remaining') })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
