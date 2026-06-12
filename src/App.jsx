import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '9999'
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ''
const AUTO_SYNC_INTERVAL = 60 * 60 * 1000 // 1 hora
const LOGO_SRC = 'data:image/png;base64,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'

// ─── DATA ─────────────────────────────────────────────────────────────────────
const GROUPS = {
  A: ['México', 'Corea del Sur', 'Sudáfrica', 'Rep. Checa'],
  B: ['Canadá', 'Suiza', 'Qatar', 'Italia'],
  C: ['Brasil', 'Marruecos', 'Escocia', 'Haití'],
  D: ['EE.UU.', 'Australia', 'Paraguay', 'Turquía'],
  E: ['Alemania', 'Ecuador', 'Costa de Marfil', 'Curazao'],
  F: ['Países Bajos', 'Japón', 'Túnez', 'Ucrania'],
  G: ['Bélgica', 'Irán', 'Egipto', 'Nueva Zelanda'],
  H: ['España', 'Uruguay', 'Arabia Saudita', 'Cabo Verde'],
  I: ['Francia', 'Senegal', 'Noruega', 'Bolivia'],
  J: ['Argentina', 'Austria', 'Argelia', 'Jordania'],
  K: ['Portugal', 'Colombia', 'Uzbekistán', 'Jamaica'],
  L: ['Inglaterra', 'Croacia', 'Panamá', 'Ghana'],
}

const MATCHES = [
  // Grupo A
  { id: 1,  group: 'A', home: 'México',        away: 'Sudáfrica',      date: '11 Jun' },
  { id: 2,  group: 'A', home: 'Corea del Sur', away: 'Rep. Checa',     date: '12 Jun' },
  { id: 3,  group: 'A', home: 'México',        away: 'Corea del Sur',  date: '16 Jun' },
  { id: 4,  group: 'A', home: 'Sudáfrica',     away: 'Rep. Checa',     date: '16 Jun' },
  { id: 5,  group: 'A', home: 'México',        away: 'Rep. Checa',     date: '20 Jun' },
  { id: 6,  group: 'A', home: 'Sudáfrica',     away: 'Corea del Sur',  date: '20 Jun' },
  // Grupo B
  { id: 7,  group: 'B', home: 'Canadá',        away: 'Suiza',          date: '12 Jun' },
  { id: 8,  group: 'B', home: 'Qatar',         away: 'Italia',         date: '12 Jun' },
  { id: 9,  group: 'B', home: 'Canadá',        away: 'Qatar',          date: '16 Jun' },
  { id: 10, group: 'B', home: 'Suiza',         away: 'Italia',         date: '17 Jun' },
  { id: 11, group: 'B', home: 'Canadá',        away: 'Italia',         date: '21 Jun' },
  { id: 12, group: 'B', home: 'Suiza',         away: 'Qatar',          date: '21 Jun' },
  // Grupo C
  { id: 13, group: 'C', home: 'Brasil',        away: 'Marruecos',      date: '13 Jun' },
  { id: 14, group: 'C', home: 'Escocia',       away: 'Haití',          date: '13 Jun' },
  { id: 15, group: 'C', home: 'Brasil',        away: 'Escocia',        date: '17 Jun' },
  { id: 16, group: 'C', home: 'Marruecos',     away: 'Haití',          date: '17 Jun' },
  { id: 17, group: 'C', home: 'Brasil',        away: 'Haití',          date: '21 Jun' },
  { id: 18, group: 'C', home: 'Marruecos',     away: 'Escocia',        date: '21 Jun' },
  // Grupo D
  { id: 19, group: 'D', home: 'EE.UU.',        away: 'Australia',      date: '13 Jun' },
  { id: 20, group: 'D', home: 'Paraguay',      away: 'Turquía',        date: '14 Jun' },
  { id: 21, group: 'D', home: 'EE.UU.',        away: 'Paraguay',       date: '18 Jun' },
  { id: 22, group: 'D', home: 'Australia',     away: 'Turquía',        date: '18 Jun' },
  { id: 23, group: 'D', home: 'EE.UU.',        away: 'Turquía',        date: '22 Jun' },
  { id: 24, group: 'D', home: 'Australia',     away: 'Paraguay',       date: '22 Jun' },
  // Grupo E
  { id: 25, group: 'E', home: 'Alemania',      away: 'Ecuador',        date: '14 Jun' },
  { id: 26, group: 'E', home: 'Costa de Marfil', away: 'Curazao',      date: '14 Jun' },
  { id: 27, group: 'E', home: 'Alemania',      away: 'Costa de Marfil', date: '18 Jun' },
  { id: 28, group: 'E', home: 'Ecuador',       away: 'Curazao',        date: '18 Jun' },
  { id: 29, group: 'E', home: 'Alemania',      away: 'Curazao',        date: '22 Jun' },
  { id: 30, group: 'E', home: 'Ecuador',       away: 'Costa de Marfil', date: '22 Jun' },
  // Grupo F
  { id: 31, group: 'F', home: 'Países Bajos',  away: 'Japón',          date: '14 Jun' },
  { id: 32, group: 'F', home: 'Túnez',         away: 'Ucrania',        date: '15 Jun' },
  { id: 33, group: 'F', home: 'Países Bajos',  away: 'Túnez',          date: '19 Jun' },
  { id: 34, group: 'F', home: 'Japón',         away: 'Ucrania',        date: '19 Jun' },
  { id: 35, group: 'F', home: 'Países Bajos',  away: 'Ucrania',        date: '23 Jun' },
  { id: 36, group: 'F', home: 'Japón',         away: 'Túnez',          date: '23 Jun' },
  // Grupo G
  { id: 37, group: 'G', home: 'Bélgica',       away: 'Irán',           date: '15 Jun' },
  { id: 38, group: 'G', home: 'Egipto',        away: 'Nueva Zelanda',  date: '15 Jun' },
  { id: 39, group: 'G', home: 'Bélgica',       away: 'Egipto',         date: '19 Jun' },
  { id: 40, group: 'G', home: 'Irán',          away: 'Nueva Zelanda',  date: '19 Jun' },
  { id: 41, group: 'G', home: 'Bélgica',       away: 'Nueva Zelanda',  date: '23 Jun' },
  { id: 42, group: 'G', home: 'Irán',          away: 'Egipto',         date: '23 Jun' },
  // Grupo H
  { id: 43, group: 'H', home: 'España',        away: 'Uruguay',        date: '15 Jun' },
  { id: 44, group: 'H', home: 'Arabia Saudita', away: 'Cabo Verde',    date: '15 Jun' },
  { id: 45, group: 'H', home: 'España',        away: 'Arabia Saudita', date: '19 Jun' },
  { id: 46, group: 'H', home: 'Uruguay',       away: 'Cabo Verde',     date: '20 Jun' },
  { id: 47, group: 'H', home: 'España',        away: 'Cabo Verde',     date: '24 Jun' },
  { id: 48, group: 'H', home: 'Uruguay',       away: 'Arabia Saudita', date: '24 Jun' },
  // Grupo I
  { id: 49, group: 'I', home: 'Francia',       away: 'Senegal',        date: '16 Jun' },
  { id: 50, group: 'I', home: 'Noruega',       away: 'Bolivia',        date: '16 Jun' },
  { id: 51, group: 'I', home: 'Francia',       away: 'Noruega',        date: '20 Jun' },
  { id: 52, group: 'I', home: 'Senegal',       away: 'Bolivia',        date: '20 Jun' },
  { id: 53, group: 'I', home: 'Francia',       away: 'Bolivia',        date: '24 Jun' },
  { id: 54, group: 'I', home: 'Senegal',       away: 'Noruega',        date: '24 Jun' },
  // Grupo J
  { id: 55, group: 'J', home: 'Argentina',     away: 'Austria',        date: '16 Jun' },
  { id: 56, group: 'J', home: 'Argelia',       away: 'Jordania',       date: '17 Jun' },
  { id: 57, group: 'J', home: 'Argentina',     away: 'Argelia',        date: '21 Jun' },
  { id: 58, group: 'J', home: 'Austria',       away: 'Jordania',       date: '21 Jun' },
  { id: 59, group: 'J', home: 'Argentina',     away: 'Jordania',       date: '25 Jun' },
  { id: 60, group: 'J', home: 'Austria',       away: 'Argelia',        date: '25 Jun' },
  // Grupo K
  { id: 61, group: 'K', home: 'Portugal',      away: 'Colombia',       date: '17 Jun' },
  { id: 62, group: 'K', home: 'Uzbekistán',    away: 'Jamaica',        date: '17 Jun' },
  { id: 63, group: 'K', home: 'Portugal',      away: 'Uzbekistán',     date: '21 Jun' },
  { id: 64, group: 'K', home: 'Colombia',      away: 'Jamaica',        date: '22 Jun' },
  { id: 65, group: 'K', home: 'Portugal',      away: 'Jamaica',        date: '26 Jun' },
  { id: 66, group: 'K', home: 'Colombia',      away: 'Uzbekistán',     date: '26 Jun' },
  // Grupo L
  { id: 67, group: 'L', home: 'Inglaterra',    away: 'Croacia',        date: '17 Jun' },
  { id: 68, group: 'L', home: 'Panamá',        away: 'Ghana',          date: '18 Jun' },
  { id: 69, group: 'L', home: 'Inglaterra',    away: 'Panamá',         date: '22 Jun' },
  { id: 70, group: 'L', home: 'Croacia',       away: 'Ghana',          date: '22 Jun' },
  { id: 71, group: 'L', home: 'Inglaterra',    away: 'Ghana',          date: '26 Jun' },
  { id: 72, group: 'L', home: 'Croacia',       away: 'Panamá',         date: '26 Jun' },
]

const ALL_TEAMS = [
  'Argentina','Brasil','Francia','España','Portugal','Alemania',
  'Inglaterra','Países Bajos','Bélgica','Uruguay','Colombia','México',
  'Ecuador','Croacia','Suiza','Senegal','Japón','Corea del Sur',
  'Marruecos','Ghana','Australia','EE.UU.','Canadá','Arabia Saudita',
  'Turquía','Qatar','Italia','Noruega','Escocia','Austria',
  'Argelia','Irán','Egipto','Panamá','Uzbekistán','Jamaica',
]

const TOP_SCORERS = [
  'Lionel Messi','Kylian Mbappé','Erling Haaland','Vinicius Jr.',
  'Harry Kane','Lautaro Martínez','Pedri','Jude Bellingham',
  'Rodri','Luis Díaz','Antoine Griezmann','Raphinha',
]

const FLAG_EMOJIS = {
  'Argentina':'🇦🇷','Brasil':'🇧🇷','Francia':'🇫🇷','España':'🇪🇸',
  'Portugal':'🇵🇹','Alemania':'🇩🇪','Inglaterra':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Italia':'🇮🇹',
  'Países Bajos':'🇳🇱','Bélgica':'🇧🇪','Uruguay':'🇺🇾','Colombia':'🇨🇴',
  'México':'🇲🇽','Ecuador':'🇪🇨','Croacia':'🇭🇷','Suiza':'🇨🇭',
  'Senegal':'🇸🇳','Japón':'🇯🇵','Corea del Sur':'🇰🇷','Marruecos':'🇲🇦',
  'Ghana':'🇬🇭','Australia':'🇦🇺','EE.UU.':'🇺🇸','Canadá':'🇨🇦',
  'Arabia Saudita':'🇸🇦','Turquía':'🇹🇷','Qatar':'🇶🇦','Noruega':'🇳🇴',
  'Escocia':'🏴󠁧󠁢󠁳󠁣󠁴󠁿','Austria':'🇦🇹','Argelia':'🇩🇿','Irán':'🇮🇷',
  'Egipto':'🇪🇬','Panamá':'🇵🇦','Uzbekistán':'🇺🇿','Jamaica':'🇯🇲',
  'Sudáfrica':'🇿🇦','Rep. Checa':'🇨🇿','Haití':'🇭🇹','Paraguay':'🇵🇾',
  'Costa de Marfil':'🇨🇮','Curazao':'🇨🇼','Túnez':'🇹🇳','Ucrania':'🇺🇦',
  'Nueva Zelanda':'🇳🇿','Cabo Verde':'🇨🇻','Bolivia':'🇧🇴','Jordania':'🇯🇴',
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function calcScore(predictions = {}, champion, topScorer, officialResults = {}, officialChampion = '', officialTopScorer = '') {
  let pts = 0
  Object.entries(officialResults).forEach(([id, official]) => {
    const pred = predictions[id]
    if (!pred || pred.home === undefined || pred.away === undefined) return
    const offRes  = official.home > official.away ? 'H' : official.home < official.away ? 'A' : 'D'
    const predRes = pred.home    > pred.away      ? 'H' : pred.home    < pred.away      ? 'A' : 'D'
    if (predRes === offRes) pts += 1
    if (pred.home === official.home && pred.away === official.away) pts += 3
  })
  if (champion   && officialChampion  && champion   === officialChampion)  pts += 5
  if (topScorer  && officialTopScorer && topScorer  === officialTopScorer) pts += 3
  return pts
}

async function fetchResultsFromAI() {
  const matchList = MATCHES.map(m => `ID ${m.id}: ${m.home} vs ${m.away} (${m.date})`).join('\n')
  const prompt = `Sos un asistente especializado en fútbol. Buscá en la web los resultados oficiales y finales del Mundial 2026 (FIFA World Cup 2026).

Lista de partidos:
${matchList}

Para cada partido que YA TERMINÓ, incluí el resultado final. Si no se jugó todavía, no lo incluyas.
También indicá el campeón del torneo y el goleador si ya se definieron.

Respondé ÚNICAMENTE con JSON válido (sin markdown, sin texto extra):
{
  "results": {
    "1": {"home": 2, "away": 0}
  },
  "champion": "Argentina",
  "topScorer": "Lionel Messi",
  "source": "nombre de la fuente consultada",
  "timestamp": "hora de los datos"
}
Si no hay partidos jugados: {"results": {}, "champion": "", "topScorer": "", "source": "sin datos", "timestamp": ""}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await response.json()
  const textBlock = data.content?.find(b => b.type === 'text')
  if (!textBlock) throw new Error('Sin respuesta de texto de la IA')
  const clean = textBlock.text.replace(/```json|```/g, '').trim()
  const jsonMatch = clean.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No se encontró JSON en la respuesta')
  return JSON.parse(jsonMatch[0])
}

// ─── SUPABASE DB LAYER ────────────────────────────────────────────────────────
const db = {
  async getUser(alias) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('alias', alias.toLowerCase().trim())
      .single()
    if (error?.code === 'PGRST116') return null // not found
    if (error) throw error
    return data
  },

  async createUser(alias, pin, phone = '') {
    const { data, error } = await supabase
      .from('users')
      .insert({ alias: alias.toLowerCase().trim(), pin, phone, predictions: {}, champion: '', top_scorer: '' })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateUser(alias, predictions, champion, topScorer) {
    const { error } = await supabase
      .from('users')
      .update({ predictions, champion, top_scorer: topScorer })
      .eq('alias', alias.toLowerCase().trim())
    if (error) throw error
  },

  async getLeaderboard() {
    const { data, error } = await supabase
      .from('users')
      .select('alias, predictions, champion, top_scorer')
    if (error) throw error
    return data || []
  },

  async getOfficialResults() {
    const { data, error } = await supabase
      .from('official_results')
      .select('*')
      .eq('id', 1)
      .single()
    if (error) throw error
    return data
  },

  async saveOfficialResults({ results, champion, topScorer, syncSource = '', syncError = '', lastSyncedAt = new Date().toISOString() }) {
    const { error } = await supabase
      .from('official_results')
      .update({
        results,
        champion,
        top_scorer: topScorer,
        sync_source: syncSource,
        sync_error: syncError,
        last_synced_at: lastSyncedAt,
      })
      .eq('id', 1)
    if (error) throw error
  },
}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────
function Flag({ team, size = 18 }) {
  return <span style={{ fontSize: size }}>{FLAG_EMOJIS[team] || '🏳️'}</span>
}

function ScoreBadge({ pts }) {
  const color = pts >= 10 ? '#00e5a0' : pts >= 5 ? '#f7c948' : '#8b8fa8'
  return (
    <span style={{
      background: color + '22', color, border: `1px solid ${color}44`,
      borderRadius: 20, padding: '2px 10px', fontSize: 13, fontWeight: 700,
    }}>{pts} pts</span>
  )
}

function SyncBar({ official, isSyncing }) {
  if (!official) return null
  const lastSync = official.last_synced_at ? new Date(official.last_synced_at) : null
  const mins = lastSync ? Math.round((Date.now() - lastSync.getTime()) / 60000) : null
  return (
    <div style={{ background: '#0d1117', borderBottom: '1px solid #1e2535', padding: '7px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
      <span style={{ color: '#4a5568' }}>
        {isSyncing
          ? '🔄 Actualizando resultados...'
          : lastSync
            ? `📡 Sync: hace ${mins < 1 ? '<1 min' : `${mins} min`} · ${official.sync_source || '—'}`
            : '📡 Sin sincronización aún'}
      </span>
      {official.sync_error && <span style={{ color: '#ff6b6b' }}>⚠ {official.sync_error.slice(0, 60)}</span>}
    </div>
  )
}

// ─── MATCH CARD ───────────────────────────────────────────────────────────────
function MatchCard({ match, predictions, officialResults, setPred, S, showGroup = false }) {
  const pred = predictions[match.id] || {}
  const off = officialResults[match.id]
  const hasOfficial = !!off
  let predResult = null, offResult = null
  if (pred.home !== undefined && pred.away !== undefined)
    predResult = pred.home > pred.away ? 'H' : pred.home < pred.away ? 'A' : 'D'
  if (off) offResult = off.home > off.away ? 'H' : off.home < off.away ? 'A' : 'D'
  const correct = off && predResult === offResult
  const exact = off && pred.home === off.home && pred.away === off.away
  return (
    <div style={{ ...S.card, borderColor: exact ? '#00e5a044' : correct ? '#f7c94844' : '#1e2535' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ color: '#4a5568', fontSize: 11 }}>
          {showGroup ? `Grupo ${match.group}` : `📅 ${match.date}`}
        </span>
        {exact && <span style={{ color: '#00e5a0', fontSize: 12, fontWeight: 700 }}>⭐ Exacto +3</span>}
        {correct && !exact && <span style={{ color: '#f7c948', fontSize: 12, fontWeight: 700 }}>✓ Resultado +1</span>}
        {hasOfficial && !correct && predResult !== null && <span style={{ color: '#ff6b6b', fontSize: 12 }}>✗ Sin puntos</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}><Flag team={match.home} /> {match.home}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="number" min="0" max="20" style={S.input} value={pred.home ?? ''} onChange={e => setPred(match.id, 'home', e.target.value)} disabled={hasOfficial} placeholder="–" />
          <span style={{ color: '#4a5568', fontWeight: 700 }}>:</span>
          <input type="number" min="0" max="20" style={S.input} value={pred.away ?? ''} onChange={e => setPred(match.id, 'away', e.target.value)} disabled={hasOfficial} placeholder="–" />
        </div>
        <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}><Flag team={match.away} /> {match.away}</div>
      </div>
      {hasOfficial && <div style={{ textAlign: 'center', marginTop: 10, color: '#4a5568', fontSize: 12 }}>Oficial: <strong style={{ color: '#fff' }}>{off.home} – {off.away}</strong></div>}
    </div>
  )
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [alias, setAlias] = useState('')
  const [pin, setPin] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!alias.trim() || pin.length !== 4) { setError('Ingresá un alias y un PIN de 4 dígitos.'); return }
    if (mode === 'register' && !phone.trim()) { setError('Ingresá tu número de teléfono.'); return }
    setLoading(true); setError('')
    try {
      if (mode === 'register') {
        const existing = await db.getUser(alias)
        if (existing) { setError('Ese alias ya existe. Probá con otro.'); setLoading(false); return }
        const user = await db.createUser(alias, pin, phone)
        onLogin(user)
      } else {
        const user = await db.getUser(alias)
        if (!user) { setError('Alias no encontrado. ¿Querés registrarte?'); setLoading(false); return }
        if (user.pin !== pin) { setError('PIN incorrecto.'); setLoading(false); return }
        onLogin(user)
      }
    } catch (e) {
      setError('Error de conexión. Revisá tu internet.')
    }
    setLoading(false)
  }

  const inputStyle = { width: '100%', marginTop: 8, padding: '13px 16px', background: '#0d1117', border: '1px solid #1e2535', borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }
  const labelStyle = { color: '#8892a0', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1b2e 50%, #0a1628 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img src={LOGO_SRC} alt="APPro" style={{ height: 48, marginBottom: 16 }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 28 }}>⚽</span>
            <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, margin: 0, background: 'linear-gradient(90deg, #f7c948, #ff6b35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Prode 2026</h1>
          </div>
          <p style={{ color: '#5a6070', fontSize: 13, margin: 0 }}>Mundial USA · México · Canadá</p>
        </div>
        <div style={{ background: '#111827', borderRadius: 20, padding: 28, border: '1px solid #1e2535', boxShadow: '0 24px 64px #00000060' }}>
          <div style={{ display: 'flex', background: '#0a0e1a', borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }} style={{
                flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
                background: mode === m ? 'linear-gradient(90deg,#f7c948,#ff6b35)' : 'transparent',
                color: mode === m ? '#0a0e1a' : '#5a6070',
              }}>{m === 'login' ? 'Ingresar' : 'Registrarse'}</button>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Alias</label>
            <input value={alias} onChange={e => setAlias(e.target.value)} placeholder="Tu nombre de jugador"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>PIN (4 dígitos)</label>
            <input value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••" type="password" inputMode="numeric"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ ...inputStyle, fontSize: 20, letterSpacing: 8 }} />
          </div>
          {mode === 'register' && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Teléfono <span style={{ color: '#f7c948' }}>*</span></label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+54 9 11 1234-5678"
                type="tel" inputMode="tel"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={inputStyle} />
              <p style={{ color: '#4a5568', fontSize: 11, marginTop: 6 }}>📞 Lo usaremos para contactarte si ganás</p>
            </div>
          )}
          {error && <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 16, background: '#ff6b6b11', borderRadius: 8, padding: '10px 14px' }}>{error}</div>}
          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', padding: '15px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(90deg,#f7c948,#ff6b35)', color: '#0a0e1a', fontSize: 16, fontWeight: 800, opacity: loading ? 0.7 : 1, marginTop: 4,
          }}>{loading ? 'Conectando...' : mode === 'login' ? 'Entrar al Prode' : 'Crear mi cuenta'}</button>
        </div>
        <p style={{ textAlign: 'center', color: '#2a3040', fontSize: 12, marginTop: 16 }}>
          🏆 Resultado +1 · Exacto +3 · Campeón +5 · Goleador +3
        </p>
      </div>
    </div>
  )
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ official, onSave, onForceSync, isSyncing, onClose }) {
  const [localResults, setLocalResults] = useState({ ...(official?.results || {}) })
  const [localChampion, setLocalChampion] = useState(official?.champion || '')
  const [localTopScorer, setLocalTopScorer] = useState(official?.top_scorer || '')
  const [activeGroup, setActiveGroup] = useState('A')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function setRes(matchId, side, val) {
    const num = parseInt(val)
    if (isNaN(num) || num < 0) return
    setLocalResults(prev => ({ ...prev, [matchId]: { ...prev[matchId], [side]: num } }))
  }
  function clearRes(matchId) {
    setLocalResults(prev => { const n = { ...prev }; delete n[matchId]; return n })
  }

  async function handleSave() {
    setSaving(true)
    await onSave({ results: localResults, champion: localChampion, topScorer: localTopScorer })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const groupMatches = MATCHES.filter(m => m.group === activeGroup)

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000000cc', zIndex: 200, overflowY: 'auto', padding: '20px 16px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: '#111827', borderRadius: 20, width: '100%', maxWidth: 600, height: 'fit-content', border: '1px solid #ff6b3544' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#ff6b35', fontWeight: 800, fontSize: 16 }}>🔐 Panel Admin</div>
            <div style={{ color: '#4a5568', fontSize: 12, marginTop: 2 }}>Resultados oficiales</div>
          </div>
          <button onClick={onClose} style={{ background: '#1e2535', border: 'none', color: '#8892a0', borderRadius: 8, padding: '8px 14px', cursor: 'pointer' }}>✕ Cerrar</button>
        </div>
        <div style={{ padding: 20 }}>
          {/* Auto-sync */}
          <div style={{ background: '#0d1117', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid #1e2535' }}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 8 }}>🤖 Sincronización automática (cada 1 hora)</div>
            <div style={{ color: '#4a5568', fontSize: 12, marginBottom: 12 }}>
              {official?.last_synced_at
                ? `Última sync: ${new Date(official.last_synced_at).toLocaleString('es-AR')} · ${official.sync_source || '—'}`
                : 'Sin sincronización registrada'}
            </div>
            {official?.sync_error && <div style={{ color: '#ff6b6b', fontSize: 12, marginBottom: 10 }}>⚠ {official.sync_error}</div>}
            <button onClick={onForceSync} disabled={isSyncing} style={{
              padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: isSyncing ? '#1e2535' : 'linear-gradient(90deg,#6366f1,#8b5cf6)',
              color: '#fff', fontWeight: 700, fontSize: 13,
            }}>{isSyncing ? '🔄 Buscando en la web...' : '⚡ Sincronizar ahora'}</button>
          </div>

          {/* Group tabs */}
          <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 12 }}>✏️ Edición manual</div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
            {Object.keys(GROUPS).map(g => (
              <button key={g} onClick={() => setActiveGroup(g)} style={{
                padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, flexShrink: 0,
                background: activeGroup === g ? '#ff6b35' : '#1e2535',
                color: activeGroup === g ? '#fff' : '#8892a0',
              }}>Grp {g}</button>
            ))}
          </div>

          {groupMatches.map(match => {
            const res = localResults[match.id]
            return (
              <div key={match.id} style={{ background: '#0d1117', borderRadius: 12, padding: 14, marginBottom: 10, border: '1px solid #1e2535' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ flex: 1, fontSize: 13, color: '#e2e8f0', textAlign: 'right' }}><Flag team={match.home} size={14} /> {match.home}</span>
                  <input type="number" min="0" max="20" value={res?.home ?? ''} onChange={e => setRes(match.id, 'home', e.target.value)} placeholder="–"
                    style={{ width: 44, textAlign: 'center', padding: '8px 0', background: '#1e2535', border: '1px solid #2a3040', borderRadius: 8, color: '#fff', fontSize: 16, fontWeight: 700, outline: 'none' }} />
                  <span style={{ color: '#4a5568' }}>:</span>
                  <input type="number" min="0" max="20" value={res?.away ?? ''} onChange={e => setRes(match.id, 'away', e.target.value)} placeholder="–"
                    style={{ width: 44, textAlign: 'center', padding: '8px 0', background: '#1e2535', border: '1px solid #2a3040', borderRadius: 8, color: '#fff', fontSize: 16, fontWeight: 700, outline: 'none' }} />
                  <span style={{ flex: 1, fontSize: 13, color: '#e2e8f0' }}><Flag team={match.away} size={14} /> {match.away}</span>
                  {res && <button onClick={() => clearRes(match.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: 16 }}>✕</button>}
                </div>
              </div>
            )
          })}

          {/* Champion & scorer */}
          <div style={{ background: '#0d1117', borderRadius: 12, padding: 16, marginTop: 8, border: '1px solid #1e2535' }}>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: 10 }}>Campeón oficial</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {ALL_TEAMS.map(t => (
                <button key={t} onClick={() => setLocalChampion(t === localChampion ? '' : t)} style={{
                  padding: '5px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  background: localChampion === t ? '#f7c948' : '#1e2535',
                  color: localChampion === t ? '#0a0e1a' : '#8892a0',
                }}><Flag team={t} size={12} /> {t}</button>
              ))}
            </div>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: 10 }}>Goleador oficial</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TOP_SCORERS.map(p => (
                <button key={p} onClick={() => setLocalTopScorer(p === localTopScorer ? '' : p)} style={{
                  padding: '5px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  background: localTopScorer === p ? '#f7c948' : '#1e2535',
                  color: localTopScorer === p ? '#0a0e1a' : '#8892a0',
                }}>{p}</button>
              ))}
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} style={{
            width: '100%', marginTop: 20, padding: '15px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: saved ? '#00e5a0' : 'linear-gradient(90deg,#f7c948,#ff6b35)',
            color: '#0a0e1a', fontSize: 16, fontWeight: 800,
          }}>{saving ? 'Guardando...' : saved ? '✓ Guardado' : '💾 Guardar resultados'}</button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('matches')
  const [predictions, setPredictions] = useState({})
  const [champion, setChampion] = useState('')
  const [topScorer, setTopScorer] = useState('')
  const [leaderboard, setLeaderboard] = useState([])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeGroup, setActiveGroup] = useState('A')

  const [official, setOfficial] = useState(null)
  const [isSyncing, setIsSyncing] = useState(false)

  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminPin, setAdminPin] = useState('')
  const [adminError, setAdminError] = useState('')
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  // Load official results on mount + auto-sync
  useEffect(() => {
    loadOfficial()
    const interval = setInterval(runAutoSync, AUTO_SYNC_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (user) { setPredictions(user.predictions || {}); setChampion(user.champion || ''); setTopScorer(user.top_scorer || '') }
  }, [user])

  useEffect(() => { if (tab === 'leaderboard') loadLeaderboard() }, [tab, official])

  async function loadOfficial() {
    try { const data = await db.getOfficialResults(); setOfficial(data) } catch (e) { console.error('Error cargando resultados oficiales', e) }
  }

  async function runAutoSync(forced = false) {
    if (isSyncing || !ANTHROPIC_KEY) return
    setIsSyncing(true)
    try {
      const aiData = await fetchResultsFromAI()
      const current = forced ? {} : { ...(official?.results || {}) }
      const merged = { ...current, ...aiData.results }
      await db.saveOfficialResults({
        results: merged,
        champion: aiData.champion || official?.champion || '',
        topScorer: aiData.topScorer || official?.top_scorer || '',
        syncSource: aiData.source || 'Claude AI',
        syncError: '',
        lastSyncedAt: new Date().toISOString(),
      })
      await loadOfficial()
    } catch (err) {
      await db.saveOfficialResults({
        results: official?.results || {},
        champion: official?.champion || '',
        topScorer: official?.top_scorer || '',
        syncSource: official?.sync_source || '',
        syncError: err.message?.slice(0, 100) || 'Error desconocido',
        lastSyncedAt: new Date().toISOString(),
      })
      await loadOfficial()
    }
    setIsSyncing(false)
  }

  async function handleAdminSave({ results, champion: champ, topScorer: scorer }) {
    await db.saveOfficialResults({
      results, champion: champ, topScorer: scorer,
      syncSource: 'Manual (admin)',
      syncError: '',
      lastSyncedAt: new Date().toISOString(),
    })
    await loadOfficial()
  }

  async function loadLeaderboard() {
    try {
      const rows = await db.getLeaderboard()
      const scored = rows.map(u => ({
        alias: u.alias,
        pts: calcScore(u.predictions, u.champion, u.top_scorer, official?.results || {}, official?.champion || '', official?.top_scorer || ''),
      })).sort((a, b) => b.pts - a.pts)
      setLeaderboard(scored)
    } catch (e) { console.error('Error cargando leaderboard', e) }
  }

  async function saveAll() {
    setSaving(true)
    try {
      await db.updateUser(user.alias, predictions, champion, topScorer)
      setUser(prev => ({ ...prev, predictions, champion, top_scorer: topScorer }))
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    } catch (e) { alert('Error guardando. Revisá tu conexión.') }
    setSaving(false)
  }

  function setPred(matchId, side, val) {
    const num = parseInt(val)
    if (isNaN(num) || num < 0 || num > 20) return
    setPredictions(prev => ({ ...prev, [matchId]: { ...prev[matchId], [side]: num } }))
  }

  function handleAdminLogin() {
    if (adminPin === ADMIN_PIN) { setShowAdminLogin(false); setShowAdminPanel(true); setAdminPin(''); setAdminError('') }
    else setAdminError('PIN incorrecto')
  }

  const officialResults = official?.results || {}
  const officialChampion = official?.champion || ''
  const officialTopScorer = official?.top_scorer || ''
  const [viewMode, setViewMode] = useState('group') // 'group' | 'date'

  // Sort matches by date for date view
  const DATE_ORDER = ['11 Jun','12 Jun','13 Jun','14 Jun','15 Jun','16 Jun','17 Jun','18 Jun','19 Jun','20 Jun','21 Jun','22 Jun','23 Jun','24 Jun','25 Jun','26 Jun','27 Jun']
  const matchesByDate = DATE_ORDER.reduce((acc, d) => {
    const ms = MATCHES.filter(m => m.date === d)
    if (ms.length) acc.push({ date: d, matches: ms })
    return acc
  }, [])

  const groupMatches = MATCHES.filter(m => m.group === activeGroup)
  const myScore = calcScore(predictions, champion, topScorer, officialResults, officialChampion, officialTopScorer)
  const completedPreds = Object.keys(predictions).filter(k => k !== 'knockout').length

  if (!user) return <AuthScreen onLogin={setUser} />

  const S = {
    app: { minHeight: '100vh', background: 'linear-gradient(160deg, #0a0e1a 0%, #0d1b2e 100%)', fontFamily: "'Inter', sans-serif", color: '#e2e8f0', paddingBottom: 80 },
    header: { background: '#111827cc', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1e2535', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
    nav: { position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111827', borderTop: '1px solid #1e2535', display: 'flex', zIndex: 100 },
    navBtn: (a) => ({ flex: 1, padding: '13px 0', border: 'none', cursor: 'pointer', background: 'transparent', color: a ? '#f7c948' : '#4a5568', fontSize: 10, fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, borderTop: a ? '2px solid #f7c948' : '2px solid transparent' }),
    card: { background: '#111827', border: '1px solid #1e2535', borderRadius: 16, padding: 16, marginBottom: 12 },
    input: { width: 50, textAlign: 'center', padding: '10px 0', background: '#0d1117', border: '1px solid #1e2535', borderRadius: 10, color: '#fff', fontSize: 18, fontWeight: 700, outline: 'none' },
  }

  return (
    <div style={S.app}>
      {showAdminPanel && <AdminPanel official={official} onSave={handleAdminSave} onForceSync={() => runAutoSync(true)} isSyncing={isSyncing} onClose={() => setShowAdminPanel(false)} />}

      {showAdminLogin && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#111827', borderRadius: 20, padding: 32, width: 300, border: '1px solid #ff6b3544' }}>
            <div style={{ fontWeight: 800, color: '#ff6b35', marginBottom: 20, fontSize: 18 }}>🔐 Acceso Admin</div>
            <input value={adminPin} onChange={e => setAdminPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              type="password" inputMode="numeric" placeholder="PIN admin"
              onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
              style={{ width: '100%', padding: '13px 16px', background: '#0d1117', border: '1px solid #1e2535', borderRadius: 12, color: '#fff', fontSize: 20, letterSpacing: 8, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
            {adminError && <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 12 }}>{adminError}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setShowAdminLogin(false); setAdminPin(''); setAdminError('') }} style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: '1px solid #1e2535', background: 'none', color: '#8892a0', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleAdminLogin} style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: 'none', background: '#ff6b35', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Entrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={LOGO_SRC} alt="APPro" style={{ height: 28 }} />
          <span style={{ color: '#4a5568', fontSize: 12 }}>⚽ Hola, {user.alias}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ScoreBadge pts={myScore} />
          <button onClick={() => setShowAdminLogin(true)} style={{ background: 'none', border: '1px solid #2a3040', color: '#4a5568', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: 11 }}>⚙</button>
          <button onClick={() => setUser(null)} style={{ background: 'none', border: '1px solid #2a3040', color: '#4a5568', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: 11 }}>Salir</button>
        </div>
      </div>

      <SyncBar official={official} isSyncing={isSyncing} />

      {/* Content */}
      <div style={{ padding: '20px 16px', maxWidth: 600, margin: '0 auto' }}>

        {/* MATCHES */}
        {tab === 'matches' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, margin: '0 0 4px' }}>Fase de Grupos</h2>
              <p style={{ color: '#4a5568', fontSize: 13, margin: 0 }}>{completedPreds} / {MATCHES.length} pronosticados</p>
            </div>
            <div style={{ height: 4, background: '#1e2535', borderRadius: 4, marginBottom: 16, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg,#f7c948,#ff6b35)', width: `${(completedPreds / MATCHES.length) * 100}%`, transition: 'width .4s' }} />
            </div>

            {/* View toggle */}
            <div style={{ display: 'flex', background: '#0a0e1a', borderRadius: 12, padding: 4, marginBottom: 16 }}>
              {[['group','🏟 Por Grupo'],['date','📅 Por Fecha']].map(([mode, label]) => (
                <button key={mode} onClick={() => setViewMode(mode)} style={{
                  flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                  background: viewMode === mode ? 'linear-gradient(90deg,#f7c948,#ff6b35)' : 'transparent',
                  color: viewMode === mode ? '#0a0e1a' : '#5a6070',
                }}>{label}</button>
              ))}
            </div>

            {/* GROUP VIEW */}
            {viewMode === 'group' && (<>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
              {Object.keys(GROUPS).map(g => (
                <button key={g} onClick={() => setActiveGroup(g)} style={{
                  padding: '7px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0,
                  background: activeGroup === g ? 'linear-gradient(90deg,#f7c948,#ff6b35)' : '#1e2535',
                  color: activeGroup === g ? '#0a0e1a' : '#8892a0',
                }}>Grupo {g}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {GROUPS[activeGroup]?.map(t => (
                <span key={t} style={{ background: '#1e2535', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#8892a0' }}>
                  <Flag team={t} size={13} /> {t}
                </span>
              ))}
            </div>
            {groupMatches.map(match => <MatchCard key={match.id} match={match} predictions={predictions} officialResults={officialResults} setPred={setPred} S={S} />)}
            </>)}

            {/* DATE VIEW */}
            {viewMode === 'date' && matchesByDate.map(({ date, matches }) => (
              <div key={date}>
                <div style={{ color: '#f7c948', fontWeight: 700, fontSize: 13, marginBottom: 10, marginTop: 4, paddingBottom: 6, borderBottom: '1px solid #1e2535' }}>
                  📅 {date}
                </div>
                {matches.map(match => <MatchCard key={match.id} match={match} predictions={predictions} officialResults={officialResults} setPred={setPred} S={S} showGroup />)}
              </div>
            ))}
          </div>
        )}

        {/* SPECIAL */}
        {tab === 'special' && (
          <div>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, margin: '0 0 20px' }}>Pronósticos Especiales</h2>
            <div style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>🏆</span>
                <div><div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>Campeón del Mundial</div><div style={{ color: '#4a5568', fontSize: 12 }}>+5 puntos si acertás</div></div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ALL_TEAMS.map(t => (
                  <button key={t} onClick={() => setChampion(t)} style={{
                    padding: '7px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    background: champion === t ? 'linear-gradient(90deg,#f7c948,#ff6b35)' : '#1e2535',
                    color: champion === t ? '#0a0e1a' : '#8892a0',
                  }}><Flag team={t} size={14} /> {t}</button>
                ))}
              </div>
              {champion && <div style={{ marginTop: 12, color: '#f7c948', fontSize: 14, fontWeight: 700 }}>Tu campeón: <Flag team={champion} /> {champion}</div>}
              {officialChampion && <div style={{ marginTop: 6, color: '#4a5568', fontSize: 12 }}>Oficial: <strong style={{ color: '#00e5a0' }}>{officialChampion}</strong></div>}
            </div>
            <div style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>👟</span>
                <div><div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>Goleador del Mundial</div><div style={{ color: '#4a5568', fontSize: 12 }}>+3 puntos si acertás</div></div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TOP_SCORERS.map(p => (
                  <button key={p} onClick={() => setTopScorer(p)} style={{
                    padding: '7px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    background: topScorer === p ? 'linear-gradient(90deg,#f7c948,#ff6b35)' : '#1e2535',
                    color: topScorer === p ? '#0a0e1a' : '#8892a0',
                  }}>{p}</button>
                ))}
              </div>
              {topScorer && <div style={{ marginTop: 12, color: '#f7c948', fontSize: 14, fontWeight: 700 }}>Tu goleador: ⚽ {topScorer}</div>}
              {officialTopScorer && <div style={{ marginTop: 6, color: '#4a5568', fontSize: 12 }}>Oficial: <strong style={{ color: '#00e5a0' }}>{officialTopScorer}</strong></div>}
            </div>
            <div style={{ ...S.card, background: '#0d1117' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#8892a0', marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase' }}>Sistema de Puntos</div>
              {[['✅ Resultado correcto','+1'],['⭐ Marcador exacto','+3'],['🏆 Campeón','+5'],['👟 Goleador','+3']].map(([l,v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e2535' }}>
                  <span style={{ fontSize: 14 }}>{l}</span><span style={{ color: '#f7c948', fontWeight: 700 }}>{v} pts</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Tu puntaje</span>
                <ScoreBadge pts={myScore} />
              </div>
            </div>
          </div>
        )}

        {/* KNOCKOUT */}
        {tab === 'knockout' && (
          <div>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, margin: '0 0 6px' }}>Fase Eliminatoria</h2>
            <p style={{ color: '#4a5568', fontSize: 13, margin: '0 0 20px' }}>Pronosticá el ganador de cada partido</p>

            {[
              {
                round: 'R32', label: '16avos de Final', date: '28 Jun – 3 Jul', icon: '⚡',
                matches: [
                  { id: 'p73',  label: '2°A vs 2°B',              date: '28 Jun' },
                  { id: 'p74',  label: '1°E vs 3°(A/B/C/D/F)',    date: '29 Jun' },
                  { id: 'p75',  label: '1°F vs 2°C',              date: '29 Jun' },
                  { id: 'p76',  label: '1°C vs 2°F',              date: '29 Jun' },
                  { id: 'p77',  label: '1°I vs 3°(C/D/F/G/H)',    date: '30 Jun' },
                  { id: 'p78',  label: '2°E vs 2°I',              date: '30 Jun' },
                  { id: 'p79',  label: '1°A vs 3°(C/E/F/H/I)',    date: '30 Jun' },
                  { id: 'p80',  label: '1°L vs 3°(E/H/I/J/K)',    date: '1 Jul'  },
                  { id: 'p81',  label: '1°D vs 3°(B/E/F/I/J)',    date: '1 Jul'  },
                  { id: 'p82',  label: '1°G vs 3°(A/E/H/I/J)',    date: '1 Jul'  },
                  { id: 'p83',  label: '2°K vs 2°L',              date: '2 Jul'  },
                  { id: 'p84',  label: '1°H vs 2°J',              date: '2 Jul'  },
                  { id: 'p85',  label: '1°B vs 3°(E/F/G/I/J)',    date: '2 Jul'  },
                  { id: 'p86',  label: '1°J vs 2°H',              date: '3 Jul'  },
                  { id: 'p87',  label: '1°K vs 3°(D/E/I/J/L)',    date: '3 Jul'  },
                  { id: 'p88',  label: '2°D vs 2°G',              date: '3 Jul'  },
                ],
              },
              {
                round: 'R16', label: 'Octavos de Final', date: '4 – 7 Jul', icon: '🔥',
                matches: [
                  { id: 'p89', label: 'W(p74) vs W(p77)',  date: '4 Jul' },
                  { id: 'p90', label: 'W(p73) vs W(p75)',  date: '4 Jul' },
                  { id: 'p91', label: 'W(p76) vs W(p78)',  date: '5 Jul' },
                  { id: 'p92', label: 'W(p79) vs W(p80)',  date: '5 Jul' },
                  { id: 'p93', label: 'W(p83) vs W(p84)',  date: '6 Jul' },
                  { id: 'p94', label: 'W(p81) vs W(p82)',  date: '6 Jul' },
                  { id: 'p95', label: 'W(p86) vs W(p88)',  date: '7 Jul' },
                  { id: 'p96', label: 'W(p85) vs W(p87)',  date: '7 Jul' },
                ],
              },
              {
                round: 'QF', label: 'Cuartos de Final', date: '9 – 11 Jul', icon: '💥',
                matches: [
                  { id: 'p97',  label: 'W(p89) vs W(p90)', date: '9 Jul'  },
                  { id: 'p98',  label: 'W(p93) vs W(p94)', date: '10 Jul' },
                  { id: 'p99',  label: 'W(p91) vs W(p92)', date: '11 Jul' },
                  { id: 'p100', label: 'W(p95) vs W(p96)', date: '11 Jul' },
                ],
              },
              {
                round: 'SF', label: 'Semifinales', date: '14 – 15 Jul', icon: '🌟',
                matches: [
                  { id: 'p101', label: 'W(p97) vs W(p98)',   date: '14 Jul' },
                  { id: 'p102', label: 'W(p99) vs W(p100)',  date: '15 Jul' },
                ],
              },
              {
                round: 'F', label: 'Final', date: '19 Jul · MetLife Stadium, New York', icon: '🏆',
                matches: [
                  { id: 'p104', label: 'W(p101) vs W(p102)', date: '19 Jul' },
                ],
              },
            ].map(({ round, label, date, icon, matches }) => {
              const roundPreds = (predictions['knockout'] || {})[round] || {}
              const filled = Object.values(roundPreds).filter(Boolean).length
              return (
                <div key={round} style={{ ...S.card, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 24 }}>{icon}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>{label}</div>
                        <div style={{ color: '#4a5568', fontSize: 12 }}>{date}</div>
                      </div>
                    </div>
                    <div style={{ color: filled === matches.length ? '#00e5a0' : '#4a5568', fontSize: 12, fontWeight: 700 }}>
                      {filled}/{matches.length}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {matches.map(({ id, label: matchLabel, date: matchDate }) => {
                      const val = roundPreds[id] || ''
                      return (
                        <div key={id} style={{ flex: '1 1 150px' }}>
                          <div style={{ color: '#4a5568', fontSize: 11, marginBottom: 4 }}>{matchLabel} · {matchDate}</div>
                          <select value={val}
                            onChange={e => {
                              const updated = { ...predictions }
                              if (!updated['knockout']) updated['knockout'] = {}
                              if (!updated['knockout'][round]) updated['knockout'][round] = {}
                              updated['knockout'][round][id] = e.target.value
                              setPredictions(updated)
                            }}
                            style={{ width: '100%', padding: '8px 10px', background: val ? '#0d1f0d' : '#0d1117', border: `1px solid ${val ? '#00e5a044' : '#1e2535'}`, borderRadius: 10, color: val ? '#00e5a0' : '#8892a0', fontSize: 13, outline: 'none' }}>
                            <option value="">— Ganador —</option>
                            {ALL_TEAMS.map(t => <option key={t} value={t}>{FLAG_EMOJIS[t] || ''} {t}</option>)}
                          </select>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* LEADERBOARD */}
        {tab === 'leaderboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, margin: 0 }}>Posiciones</h2>
              <button onClick={loadLeaderboard} style={{ background: '#1e2535', border: 'none', color: '#8892a0', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13 }}>🔄</button>
            </div>
            {leaderboard.length === 0 && <div style={{ textAlign: 'center', color: '#4a5568', padding: 40 }}>Sin jugadores aún...</div>}
            {leaderboard.map((row, i) => (
              <div key={row.alias} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 16, borderColor: row.alias === user.alias ? '#f7c94844' : '#1e2535', background: row.alias === user.alias ? '#1a1600' : '#111827' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: i === 0 ? '#f7c948' : i === 1 ? '#b0bec5' : i === 2 ? '#cd7f32' : '#1e2535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15, color: i < 3 ? '#0a0e1a' : '#4a5568' }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: row.alias === user.alias ? '#f7c948' : '#e2e8f0' }}>{row.alias} {row.alias === user.alias && '← Vos'}</div>
                  {i === 0 && <div style={{ fontSize: 11, color: '#f7c948' }}>👑 Líder</div>}
                </div>
                <ScoreBadge pts={row.pts} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save button */}
      {(tab === 'matches' || tab === 'special' || tab === 'knockout') && (
        <button onClick={saveAll} disabled={saving} style={{
          position: 'fixed', bottom: 70, right: 20, zIndex: 99,
          background: saved ? '#00e5a0' : 'linear-gradient(90deg,#f7c948,#ff6b35)',
          color: '#0a0e1a', border: 'none', borderRadius: 50, padding: '14px 22px',
          fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 8px 24px #00000060',
          opacity: saving ? 0.7 : 1,
        }}>{saving ? 'Guardando...' : saved ? '✓ Guardado' : '💾 Guardar'}</button>
      )}

      {/* Bottom nav */}
      <div style={S.nav}>
        {[{ id: 'matches', icon: '📋', label: 'Grupos' }, { id: 'knockout', icon: '⚡', label: 'Eliminatorias' }, { id: 'special', icon: '🏆', label: 'Especiales' }, { id: 'leaderboard', icon: '📊', label: 'Posiciones' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={S.navBtn(tab === t.id)}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
