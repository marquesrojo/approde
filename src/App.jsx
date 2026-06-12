import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '9999'
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ''
const AUTO_SYNC_INTERVAL = 60 * 60 * 1000 // 1 hora

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

  async createUser(alias, pin) {
    const { data, error } = await supabase
      .from('users')
      .insert({ alias: alias.toLowerCase().trim(), pin, predictions: {}, champion: '', top_scorer: '' })
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

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [alias, setAlias] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!alias.trim() || pin.length !== 4) { setError('Ingresá un alias y un PIN de 4 dígitos.'); return }
    setLoading(true); setError('')
    try {
      if (mode === 'register') {
        const existing = await db.getUser(alias)
        if (existing) { setError('Ese alias ya existe. Probá con otro.'); setLoading(false); return }
        const user = await db.createUser(alias, pin)
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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1b2e 50%, #0a1628 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>⚽</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, margin: 0, background: 'linear-gradient(90deg, #f7c948, #ff6b35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>APProde</h1>
          <p style={{ color: '#5a6070', fontSize: 14, marginTop: 6 }}>Mundial 2026 · USA · México · Canadá</p>
        </div>
        <div style={{ background: '#111827', borderRadius: 20, padding: 32, border: '1px solid #1e2535', boxShadow: '0 24px 64px #00000060' }}>
          <div style={{ display: 'flex', background: '#0a0e1a', borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }} style={{
                flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
                background: mode === m ? 'linear-gradient(90deg,#f7c948,#ff6b35)' : 'transparent',
                color: mode === m ? '#0a0e1a' : '#5a6070',
              }}>{m === 'login' ? 'Ingresar' : 'Registrarse'}</button>
            ))}
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ color: '#8892a0', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Alias</label>
            <input value={alias} onChange={e => setAlias(e.target.value)} placeholder="Tu nombre de jugador"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', marginTop: 8, padding: '13px 16px', background: '#0d1117', border: '1px solid #1e2535', borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ color: '#8892a0', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>PIN (4 dígitos)</label>
            <input value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••" type="password" inputMode="numeric"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', marginTop: 8, padding: '13px 16px', background: '#0d1117', border: '1px solid #1e2535', borderRadius: 12, color: '#fff', fontSize: 20, letterSpacing: 8, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {error && <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 16, background: '#ff6b6b11', borderRadius: 8, padding: '10px 14px' }}>{error}</div>}
          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', padding: '15px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(90deg,#f7c948,#ff6b35)', color: '#0a0e1a', fontSize: 16, fontWeight: 800, opacity: loading ? 0.7 : 1,
          }}>{loading ? 'Conectando...' : mode === 'login' ? 'Entrar al Prode' : 'Crear mi cuenta'}</button>
        </div>
        <p style={{ textAlign: 'center', color: '#2a3040', fontSize: 12, marginTop: 20 }}>
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
  const groupMatches = MATCHES.filter(m => m.group === activeGroup)
  const myScore = calcScore(predictions, champion, topScorer, officialResults, officialChampion, officialTopScorer)
  const completedPreds = Object.keys(predictions).length

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
          <span style={{ fontWeight: 900, fontSize: 18, background: 'linear-gradient(90deg,#f7c948,#ff6b35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>APProde ⚽</span>
          <span style={{ color: '#4a5568', fontSize: 12 }}>Hola, {user.alias}</span>
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
            <div style={{ height: 4, background: '#1e2535', borderRadius: 4, marginBottom: 20, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg,#f7c948,#ff6b35)', width: `${(completedPreds / MATCHES.length) * 100}%`, transition: 'width .4s' }} />
            </div>
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
            {groupMatches.map(match => {
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
                <div key={match.id} style={{ ...S.card, borderColor: exact ? '#00e5a044' : correct ? '#f7c94844' : '#1e2535' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ color: '#4a5568', fontSize: 11 }}>📅 {match.date}</span>
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
            })}
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
      {(tab === 'matches' || tab === 'special') && (
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
        {[{ id: 'matches', icon: '📋', label: 'Partidos' }, { id: 'special', icon: '🏆', label: 'Especiales' }, { id: 'leaderboard', icon: '📊', label: 'Posiciones' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={S.navBtn(tab === t.id)}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
