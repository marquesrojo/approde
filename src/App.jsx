import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '9999'
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
  K: ['Portugal', 'Colombia', 'Uzbekistán', 'RD Congo'],
  L: ['Inglaterra', 'Croacia', 'Panamá', 'Ghana'],
}

const MATCHES = [
  // Grupo A
  { id: 1,  group: 'A', home: 'México',          away: 'Sudáfrica',       date: '11 Jun', time: '16:00 ARG', kickoff: '2026-06-11T19:00:00Z' },
  { id: 2,  group: 'A', home: 'Corea del Sur',   away: 'Rep. Checa',      date: '11 Jun', time: '23:00 ARG', kickoff: '2026-06-12T02:00:00Z' },
  { id: 3,  group: 'A', home: 'México',          away: 'Corea del Sur',   date: '18 Jun', time: '22:00 ARG', kickoff: '2026-06-19T01:00:00Z' },
  { id: 4,  group: 'A', home: 'Sudáfrica',       away: 'Rep. Checa',      date: '18 Jun', time: '13:00 ARG', kickoff: '2026-06-18T16:00:00Z' },
  { id: 5,  group: 'A', home: 'México',          away: 'Rep. Checa',      date: '24 Jun', time: '22:00 ARG', kickoff: '2026-06-25T01:00:00Z' },
  { id: 6,  group: 'A', home: 'Sudáfrica',       away: 'Corea del Sur',   date: '24 Jun', time: '22:00 ARG', kickoff: '2026-06-25T01:00:00Z' },
  // Grupo B
  { id: 7,  group: 'B', home: 'Canadá',          away: 'Bosnia',          date: '12 Jun', time: '16:00 ARG', kickoff: '2026-06-12T19:00:00Z' },
  { id: 8,  group: 'B', home: 'Qatar',           away: 'Suiza',           date: '13 Jun', time: '16:00 ARG', kickoff: '2026-06-13T19:00:00Z' },
  { id: 9,  group: 'B', home: 'Suiza',           away: 'Bosnia',          date: '18 Jun', time: '16:00 ARG', kickoff: '2026-06-18T19:00:00Z' },
  { id: 10, group: 'B', home: 'Canadá',          away: 'Qatar',           date: '18 Jun', time: '19:00 ARG', kickoff: '2026-06-18T22:00:00Z' },
  { id: 11, group: 'B', home: 'Canadá',          away: 'Suiza',           date: '24 Jun', time: '19:00 ARG', kickoff: '2026-06-24T22:00:00Z' },
  { id: 12, group: 'B', home: 'Bosnia',          away: 'Qatar',           date: '24 Jun', time: '19:00 ARG', kickoff: '2026-06-24T22:00:00Z' },
  // Grupo C
  { id: 13, group: 'C', home: 'Brasil',          away: 'Marruecos',       date: '13 Jun', time: '19:00 ARG', kickoff: '2026-06-13T22:00:00Z' },
  { id: 14, group: 'C', home: 'Haití',           away: 'Escocia',         date: '13 Jun', time: '22:00 ARG', kickoff: '2026-06-14T01:00:00Z' },
  { id: 15, group: 'C', home: 'Brasil',          away: 'Escocia',         date: '19 Jun', time: '16:00 ARG', kickoff: '2026-06-19T19:00:00Z' },
  { id: 16, group: 'C', home: 'Marruecos',       away: 'Haití',           date: '19 Jun', time: '19:00 ARG', kickoff: '2026-06-19T22:00:00Z' },
  { id: 17, group: 'C', home: 'Brasil',          away: 'Haití',           date: '25 Jun', time: '19:00 ARG', kickoff: '2026-06-25T22:00:00Z' },
  { id: 18, group: 'C', home: 'Marruecos',       away: 'Escocia',         date: '25 Jun', time: '19:00 ARG', kickoff: '2026-06-25T22:00:00Z' },
  // Grupo D
  { id: 19, group: 'D', home: 'EE.UU.',          away: 'Paraguay',        date: '12 Jun', time: '22:00 ARG', kickoff: '2026-06-13T01:00:00Z' },
  { id: 20, group: 'D', home: 'Australia',       away: 'Turquía',         date: '14 Jun', time: '01:00 ARG', kickoff: '2026-06-14T04:00:00Z' },
  { id: 21, group: 'D', home: 'EE.UU.',          away: 'Australia',       date: '19 Jun', time: '16:00 ARG', kickoff: '2026-06-19T19:00:00Z' },
  { id: 22, group: 'D', home: 'Paraguay',        away: 'Turquía',         date: '19 Jun', time: '22:00 ARG', kickoff: '2026-06-20T01:00:00Z' },
  { id: 23, group: 'D', home: 'EE.UU.',          away: 'Turquía',         date: '25 Jun', time: '19:00 ARG', kickoff: '2026-06-25T22:00:00Z' },
  { id: 24, group: 'D', home: 'Australia',       away: 'Paraguay',        date: '25 Jun', time: '19:00 ARG', kickoff: '2026-06-25T22:00:00Z' },
  // Grupo E
  { id: 25, group: 'E', home: 'Alemania',        away: 'Curazao',         date: '14 Jun', time: '14:00 ARG', kickoff: '2026-06-14T17:00:00Z' },
  { id: 26, group: 'E', home: 'Costa de Marfil', away: 'Ecuador',         date: '14 Jun', time: '20:00 ARG', kickoff: '2026-06-14T23:00:00Z' },
  { id: 27, group: 'E', home: 'Alemania',        away: 'Costa de Marfil', date: '20 Jun', time: '16:00 ARG', kickoff: '2026-06-20T19:00:00Z' },
  { id: 28, group: 'E', home: 'Ecuador',         away: 'Curazao',         date: '20 Jun', time: '22:00 ARG', kickoff: '2026-06-21T01:00:00Z' },
  { id: 29, group: 'E', home: 'Alemania',        away: 'Ecuador',         date: '26 Jun', time: '19:00 ARG', kickoff: '2026-06-26T22:00:00Z' },
  { id: 30, group: 'E', home: 'Costa de Marfil', away: 'Curazao',         date: '26 Jun', time: '19:00 ARG', kickoff: '2026-06-26T22:00:00Z' },
  // Grupo F
  { id: 31, group: 'F', home: 'Países Bajos',    away: 'Japón',           date: '14 Jun', time: '17:00 ARG', kickoff: '2026-06-14T20:00:00Z' },
  { id: 32, group: 'F', home: 'Suecia',          away: 'Túnez',           date: '14 Jun', time: '23:00 ARG', kickoff: '2026-06-15T02:00:00Z' },
  { id: 33, group: 'F', home: 'Países Bajos',    away: 'Suecia',          date: '20 Jun', time: '16:00 ARG', kickoff: '2026-06-20T19:00:00Z' },
  { id: 34, group: 'F', home: 'Japón',           away: 'Túnez',           date: '20 Jun', time: '19:00 ARG', kickoff: '2026-06-20T22:00:00Z' },
  { id: 35, group: 'F', home: 'Países Bajos',    away: 'Túnez',           date: '26 Jun', time: '19:00 ARG', kickoff: '2026-06-26T22:00:00Z' },
  { id: 36, group: 'F', home: 'Japón',           away: 'Suecia',          date: '26 Jun', time: '19:00 ARG', kickoff: '2026-06-26T22:00:00Z' },
  // Grupo G
  { id: 37, group: 'G', home: 'Bélgica',         away: 'Egipto',          date: '15 Jun', time: '16:00 ARG', kickoff: '2026-06-15T19:00:00Z' },
  { id: 38, group: 'G', home: 'Irán',            away: 'Nueva Zelanda',   date: '15 Jun', time: '22:00 ARG', kickoff: '2026-06-16T01:00:00Z' },
  { id: 39, group: 'G', home: 'Bélgica',         away: 'Irán',            date: '21 Jun', time: '16:00 ARG', kickoff: '2026-06-21T19:00:00Z' },
  { id: 40, group: 'G', home: 'Egipto',          away: 'Nueva Zelanda',   date: '21 Jun', time: '19:00 ARG', kickoff: '2026-06-21T22:00:00Z' },
  { id: 41, group: 'G', home: 'Bélgica',         away: 'Nueva Zelanda',   date: '27 Jun', time: '19:00 ARG', kickoff: '2026-06-27T22:00:00Z' },
  { id: 42, group: 'G', home: 'Irán',            away: 'Egipto',          date: '27 Jun', time: '19:00 ARG', kickoff: '2026-06-27T22:00:00Z' },
  // Grupo H
  { id: 43, group: 'H', home: 'España',          away: 'Cabo Verde',      date: '15 Jun', time: '13:00 ARG', kickoff: '2026-06-15T16:00:00Z' },
  { id: 44, group: 'H', home: 'Arabia Saudita',  away: 'Uruguay',         date: '15 Jun', time: '19:00 ARG', kickoff: '2026-06-15T22:00:00Z' },
  { id: 45, group: 'H', home: 'España',          away: 'Arabia Saudita',  date: '21 Jun', time: '16:00 ARG', kickoff: '2026-06-21T19:00:00Z' },
  { id: 46, group: 'H', home: 'Uruguay',         away: 'Cabo Verde',      date: '21 Jun', time: '19:00 ARG', kickoff: '2026-06-21T22:00:00Z' },
  { id: 47, group: 'H', home: 'España',          away: 'Uruguay',         date: '27 Jun', time: '19:00 ARG', kickoff: '2026-06-27T22:00:00Z' },
  { id: 48, group: 'H', home: 'Arabia Saudita',  away: 'Cabo Verde',      date: '27 Jun', time: '19:00 ARG', kickoff: '2026-06-27T22:00:00Z' },
  // Grupo I
  { id: 49, group: 'I', home: 'Francia',         away: 'Senegal',         date: '16 Jun', time: '17:00 ARG', kickoff: '2026-06-16T20:00:00Z' },
  { id: 50, group: 'I', home: 'Irak',            away: 'Noruega',         date: '16 Jun', time: '20:00 ARG', kickoff: '2026-06-16T23:00:00Z' },
  { id: 51, group: 'I', home: 'Francia',         away: 'Irak',            date: '22 Jun', time: '16:00 ARG', kickoff: '2026-06-22T19:00:00Z' },
  { id: 52, group: 'I', home: 'Senegal',         away: 'Noruega',         date: '22 Jun', time: '19:00 ARG', kickoff: '2026-06-22T22:00:00Z' },
  { id: 53, group: 'I', home: 'Francia',         away: 'Noruega',         date: '27 Jun', time: '19:00 ARG', kickoff: '2026-06-27T22:00:00Z' },
  { id: 54, group: 'I', home: 'Senegal',         away: 'Irak',            date: '27 Jun', time: '19:00 ARG', kickoff: '2026-06-27T22:00:00Z' },
  // Grupo J
  { id: 55, group: 'J', home: 'Argentina',       away: 'Argelia',         date: '16 Jun', time: '22:00 ARG', kickoff: '2026-06-17T01:00:00Z' },
  { id: 56, group: 'J', home: 'Austria',         away: 'Jordania',        date: '17 Jun', time: '13:00 ARG', kickoff: '2026-06-17T16:00:00Z' },
  { id: 57, group: 'J', home: 'Argentina',       away: 'Austria',         date: '22 Jun', time: '22:00 ARG', kickoff: '2026-06-23T01:00:00Z' },
  { id: 58, group: 'J', home: 'Argelia',         away: 'Jordania',        date: '22 Jun', time: '16:00 ARG', kickoff: '2026-06-22T19:00:00Z' },
  { id: 59, group: 'J', home: 'Argentina',       away: 'Jordania',        date: '27 Jun', time: '19:00 ARG', kickoff: '2026-06-27T22:00:00Z' },
  { id: 60, group: 'J', home: 'Austria',         away: 'Argelia',         date: '27 Jun', time: '19:00 ARG', kickoff: '2026-06-27T22:00:00Z' },
  // Grupo K
  { id: 61, group: 'K', home: 'Uzbekistán',      away: 'Colombia',        date: '17 Jun', time: '20:00 ARG', kickoff: '2026-06-17T23:00:00Z' },
  { id: 62, group: 'K', home: 'Portugal',        away: 'RD Congo',        date: '17 Jun', time: '16:00 ARG', kickoff: '2026-06-17T19:00:00Z' },
  { id: 63, group: 'K', home: 'Portugal',        away: 'Uzbekistán',      date: '22 Jun', time: '22:00 ARG', kickoff: '2026-06-23T01:00:00Z' },
  { id: 64, group: 'K', home: 'Colombia',        away: 'RD Congo',        date: '23 Jun', time: '16:00 ARG', kickoff: '2026-06-23T19:00:00Z' },
  { id: 65, group: 'K', home: 'Colombia',        away: 'Portugal',        date: '27 Jun', time: '19:00 ARG', kickoff: '2026-06-27T22:00:00Z' },
  { id: 66, group: 'K', home: 'RD Congo',        away: 'Uzbekistán',      date: '27 Jun', time: '19:00 ARG', kickoff: '2026-06-27T22:00:00Z' },
  // Grupo L
  { id: 67, group: 'L', home: 'Inglaterra',      away: 'Croacia',         date: '17 Jun', time: '19:00 ARG', kickoff: '2026-06-17T22:00:00Z' },
  { id: 68, group: 'L', home: 'Panamá',          away: 'Ghana',           date: '18 Jun', time: '13:00 ARG', kickoff: '2026-06-18T16:00:00Z' },
  { id: 69, group: 'L', home: 'Inglaterra',      away: 'Panamá',          date: '23 Jun', time: '22:00 ARG', kickoff: '2026-06-24T01:00:00Z' },
  { id: 70, group: 'L', home: 'Croacia',         away: 'Ghana',           date: '23 Jun', time: '16:00 ARG', kickoff: '2026-06-23T19:00:00Z' },
  { id: 71, group: 'L', home: 'Inglaterra',      away: 'Ghana',           date: '27 Jun', time: '19:00 ARG', kickoff: '2026-06-27T22:00:00Z' },
  { id: 72, group: 'L', home: 'Croacia',         away: 'Panamá',          date: '27 Jun', time: '19:00 ARG', kickoff: '2026-06-27T22:00:00Z' },
]


const ALL_TEAMS = [
  'Argentina','Brasil','Francia','España','Portugal','Alemania',
  'Inglaterra','Países Bajos','Bélgica','Uruguay','Colombia','México',
  'Ecuador','Croacia','Suiza','Senegal','Japón','Corea del Sur',
  'Marruecos','Ghana','Australia','EE.UU.','Canadá','Arabia Saudita',
  'Turquía','Qatar','Italia','Noruega','Escocia','Austria',
  'Argelia','Irán','Egipto','Panamá','Uzbekistán','RD Congo',
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
  'Egipto':'🇪🇬','Panamá':'🇵🇦','Uzbekistán':'🇺🇿','RD Congo':'🇨🇩',
  'Sudáfrica':'🇿🇦','Rep. Checa':'🇨🇿','Haití':'🇭🇹','Paraguay':'🇵🇾',
  'Costa de Marfil':'🇨🇮','Curazao':'🇨🇼','Túnez':'🇹🇳','Ucrania':'🇺🇦',
  'Nueva Zelanda':'🇳🇿','Cabo Verde':'🇨🇻','Bolivia':'🇧🇴','Jordania':'🇯🇴',
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function calcScore(predictions = {}, officialResults = {}, bonusPoints = 0) {
  // Calculate points per match
  const matchPoints = []
  Object.entries(officialResults).forEach(([id, official]) => {
    const pred = predictions[id]
    if (!pred || pred.home === undefined || pred.away === undefined) return
    let pts = 0
    const offRes  = official.home > official.away ? 'H' : official.home < official.away ? 'A' : 'D'
    const predRes = pred.home    > pred.away      ? 'H' : pred.home    < pred.away      ? 'A' : 'D'
    if (predRes === offRes) pts += 1
    if (pred.home === official.home && pred.away === official.away) pts += 3
    matchPoints.push(pts)
  })

  // Take top 20 match scores
  matchPoints.sort((a, b) => b - a)
  const top20 = matchPoints.slice(0, 20)
  let total = top20.reduce((sum, p) => sum + p, 0)
  total += (bonusPoints || 0)
  return total
}

// Devuelve los partidos de HOY que ya empezaron pero todavía no tienen resultado oficial
function getPendingTodayMatches(officialResults = {}) {
  const now = Date.now()
  const today = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
  return MATCHES.filter(m => {
    if (!m.kickoff) return false
    if (officialResults[m.id]) return false // ya tiene resultado
    const kickoffMs = new Date(m.kickoff).getTime()
    if (kickoffMs > now) return false // todavía no empezó
    const matchDate = new Date(m.kickoff).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
    return matchDate === today
  })
}

async function fetchResultsFromAI(pending) {
  if (pending.length === 0) return null // nada para consultar, ahorramos la llamada

  const matchList = pending.map(m => `ID ${m.id}: ${m.home} vs ${m.away}`).join('\n')
  const prompt = `Buscá en la web los resultados FINALES de estos partidos del Mundial 2026 de HOY que ya deberían haber terminado:
${matchList}

Respondé SOLO con JSON sin markdown. Solo incluí los que ya terminaron con resultado definitivo:
{"results": {"1": {"home": 2, "away": 0}}, "source": "fuente consultada"}
Si ninguno terminó: {"results": {}, "source": ""}`

  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await response.json()
  if (data.error) throw new Error(`API error: ${data.error.type || ''} ${data.error.message || JSON.stringify(data.error)}`)
  const textBlock = data.content?.find(b => b.type === 'text')
  if (!textBlock) throw new Error(`Sin respuesta de texto. Respuesta: ${JSON.stringify(data).slice(0, 300)}`)
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
      .insert({ alias: alias.toLowerCase().trim(), pin, phone, avatar: '⚽', predictions: {} })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateUser(alias, predictions) {
    const { error } = await supabase
      .from('users')
      .update({ predictions })
      .eq('alias', alias.toLowerCase().trim())
    if (error) throw error
  },

  async updateAvatar(alias, avatar) {
    const { error } = await supabase
      .from('users')
      .update({ avatar })
      .eq('alias', alias.toLowerCase().trim())
    if (error) throw error
  },

  async getLeaderboard() {
    const { data, error } = await supabase
      .from('users')
      .select('alias, predictions, bonus_points, avatar')
    if (error) throw error
    return data || []
  },

  async getUserProfile(alias) {
    const { data, error } = await supabase
      .from('users')
      .select('alias, predictions, bonus_points, avatar')
      .eq('alias', alias.toLowerCase().trim())
      .single()
    if (error) throw error
    return data
  },

  async getPlayerReactions(toAlias) {
    const { data } = await supabase.from('player_reactions').select('*').eq('to_alias', toAlias)
    return data || []
  },
  async setPlayerReaction(toAlias, fromAlias, matchId, emoji) {
    await supabase.from('player_reactions')
      .upsert({ to_alias: toAlias, from_alias: fromAlias, match_id: matchId, emoji }, { onConflict: 'to_alias,from_alias,match_id' })
  },

  // Leagues
  async createLeague(name, ownerAlias) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    const { data, error } = await supabase
      .from('leagues')
      .insert({ name, owner_alias: ownerAlias, invite_code: code })
      .select().single()
    if (error) throw error
    await supabase.from('league_members').insert({ league_id: data.id, alias: ownerAlias })
    return data
  },
  async joinLeague(leagueId, alias) {
    const { error } = await supabase.from('league_members').upsert({ league_id: leagueId, alias }, { onConflict: 'league_id,alias' })
    if (error) throw error
  },
  async getLeagueByCode(code) {
    const { data, error } = await supabase.from('leagues').select('*').eq('invite_code', code.toUpperCase()).single()
    if (error) return null
    return data
  },
  async getMyLeagues(alias) {
    const { data } = await supabase.from('league_members').select('league_id, leagues(*)').eq('alias', alias)
    return (data || []).map(r => r.leagues).filter(Boolean)
  },
  async getLeagueMembers(leagueId) {
    const { data } = await supabase.from('league_members').select('alias').eq('league_id', leagueId)
    return (data || []).map(r => r.alias)
  },

  async removeMember(leagueId, alias) {
    const { error } = await supabase.from('league_members').delete().eq('league_id', leagueId).eq('alias', alias)
    if (error) throw error
  },

  async renameLeague(leagueId, newName) {
    const { error } = await supabase.from('leagues').update({ name: newName }).eq('id', leagueId)
    if (error) throw error
  },

  async addBonusPoint(alias) {
    const user = await this.getUser(alias)
    const current = user?.bonus_points || 0
    const { error } = await supabase
      .from('users')
      .update({ bonus_points: current + 1 })
      .eq('alias', alias.toLowerCase().trim())
    if (error) throw error
  },

  async subtractBonusPoint(alias) {
    const user = await this.getUser(alias)
    const current = user?.bonus_points || 0
    const { error } = await supabase
      .from('users')
      .update({ bonus_points: current - 1 })
      .eq('alias', alias.toLowerCase().trim())
    if (error) throw error
  },

  async createChallenge(fromAlias, toAlias, matchId) {
    const { data, error } = await supabase
      .from('challenges')
      .insert({ from_alias: fromAlias, to_alias: toAlias, match_id: matchId, status: 'pending' })
      .select().single()
    if (error) throw error
    return data
  },

  async getChallenges(alias) {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .or(`from_alias.eq.${alias},to_alias.eq.${alias}`)
      .order('created_at', { ascending: false })
    if (error) return []
    return data || []
  },

  async acceptChallenge(id) {
    const { error } = await supabase.from('challenges').update({ status: 'accepted' }).eq('id', id)
    if (error) throw error
  },

  async deleteChallenge(id) {
    const { error } = await supabase.from('challenges').update({ status: 'cancelled' }).eq('id', id)
    if (error) throw error
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

  async saveOfficialResults({ results, syncSource = '', syncError = '', lastSyncedAt = new Date().toISOString() }) {
    const { error } = await supabase
      .from('official_results')
      .update({
        results,
        sync_source: syncSource,
        sync_error: syncError,
        last_synced_at: lastSyncedAt,
      })
      .eq('id', 1)
    if (error) throw error
  },

  // Actualiza solo el estado del sync (fuente/error/hora), NUNCA toca `results`
  async updateSyncStatus({ syncSource = '', syncError = '', lastSyncedAt = new Date().toISOString() }) {
    const { error } = await supabase
      .from('official_results')
      .update({
        sync_source: syncSource,
        sync_error: syncError,
        last_synced_at: lastSyncedAt,
      })
      .eq('id', 1)
    if (error) throw error
  },
}

// ─── AVATARS ──────────────────────────────────────────────────────────────────
const AVATARS = [
  '⚽','🏆','🥇','🔥','⭐','🎯','🦁','🐯','🦊','🐺',
  '🦅','🐉','🤖','👑','💎','🚀','⚡','🎪','🎭','🃏',
  '🇦🇷','🇧🇷','🇫🇷','🇪🇸','🇵🇹','🇩🇪','🏴󠁧󠁢󠁥󠁮󠁧󠁿','🇮🇹','🇳🇱','🇧🇪',
]

// ─── BADGES ───────────────────────────────────────────────────────────────────
function calcBadges(predictions = {}, officialResults = {}, played = 0) {
  const badges = []
  if (played >= 72) badges.push({ id: 'full', emoji: '📋', label: 'Completista', desc: 'Pronosticaste todos los partidos' })
  if (played >= 20) badges.push({ id: 'active', emoji: '🎯', label: 'Clasificado', desc: 'Más de 20 partidos pronosticados' })

  let exactCount = 0, correctStreak = 0, maxStreak = 0
  const played_ids = Object.keys(officialResults)
  for (const id of played_ids) {
    const pred = predictions[id]
    const off = officialResults[id]
    if (!pred || pred.home === undefined) { correctStreak = 0; continue }
    const offRes = off.home > off.away ? 'H' : off.home < off.away ? 'A' : 'D'
    const predRes = pred.home > pred.away ? 'H' : pred.home < pred.away ? 'A' : 'D'
    const exact = pred.home === off.home && pred.away === off.away
    if (exact) exactCount++
    if (predRes === offRes) { correctStreak++; maxStreak = Math.max(maxStreak, correctStreak) }
    else correctStreak = 0
  }
  if (exactCount >= 1)  badges.push({ id: 'exact1',  emoji: '⭐', label: 'Precisión', desc: 'Primer marcador exacto' })
  if (exactCount >= 5)  badges.push({ id: 'exact5',  emoji: '🌟', label: 'Francotirador', desc: '5 marcadores exactos' })
  if (exactCount >= 10) badges.push({ id: 'exact10', emoji: '💫', label: 'Oráculo', desc: '10 marcadores exactos' })
  if (maxStreak >= 3)   badges.push({ id: 'streak3', emoji: '🔥', label: 'En Racha', desc: '3 resultados correctos seguidos' })
  if (maxStreak >= 5)   badges.push({ id: 'streak5', emoji: '⚡', label: 'Imparable', desc: '5 resultados correctos seguidos' })
  return badges
}
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

// ─── AVATAR PICKER ────────────────────────────────────────────────────────────
function AvatarPicker({ current, onSelect, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000000dd', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#111827', borderRadius: 20, padding: 24, width: '100%', maxWidth: 380, border: '1px solid #1e2535' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>🎨 Elegí tu avatar</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4a5568', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {AVATARS.map(a => (
            <button key={a} onClick={() => { onSelect(a); onClose() }} style={{
              fontSize: 32, background: current === a ? '#f7c94822' : '#0d1117',
              border: `2px solid ${current === a ? '#f7c948' : '#1e2535'}`,
              borderRadius: 12, padding: '8px 10px', cursor: 'pointer', transition: 'all .15s',
            }}>{a}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── REACTIONS ────────────────────────────────────────────────────────────────
const REACTION_EMOJIS = ['🔥','😱','🎉','😤','🤯','👏','😭','🏆']

// ─── LEAGUES ──────────────────────────────────────────────────────────────────
function LeaguesPanel({ myAlias, officialResults, onClose }) {
  const [leagues, setLeagues] = useState([])
  const [view, setView] = useState('list') // list | create | join | detail
  const [newName, setNewName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [selectedLeague, setSelectedLeague] = useState(null)
  const [leagueMembers, setLeagueMembers] = useState([])
  const [leagueMembersData, setLeagueMembersData] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { loadMyLeagues() }, [])

  async function loadMyLeagues() {
    const data = await db.getMyLeagues(myAlias)
    setLeagues(data)
  }

  async function createLeague() {
    if (!newName.trim()) return
    setLoading(true)
    try {
      const league = await db.createLeague(newName.trim(), myAlias)
      await loadMyLeagues()
      setMsg(`Liga creada. Código: ${league.invite_code}`)
      setNewName('')
      setView('list')
    } catch { setMsg('Error al crear la liga') }
    setLoading(false)
  }

  async function joinLeague() {
    if (!joinCode.trim()) return
    setLoading(true)
    try {
      const league = await db.getLeagueByCode(joinCode)
      if (!league) { setMsg('Código inválido'); setLoading(false); return }
      await db.joinLeague(league.id, myAlias)
      await loadMyLeagues()
      setMsg(`¡Te uniste a ${league.name}!`)
      setJoinCode('')
      setView('list')
    } catch { setMsg('Error al unirse') }
    setLoading(false)
  }

  async function openLeague(league) {
    setSelectedLeague(league)
    const members = await db.getLeagueMembers(league.id)
    setLeagueMembers(members)
    const allUsers = await db.getLeaderboard()
    const filtered = allUsers.filter(u => members.includes(u.alias))
    const scored = filtered.map(u => ({
      alias: u.alias,
      avatar: u.avatar || '⚽',
      pts: calcScore(u.predictions, officialResults, u.bonus_points || 0),
      played: Object.keys(u.predictions || {}).filter(k => k !== 'knockout' && u.predictions[k]?.home !== undefined).length,
    })).sort((a, b) => b.pts - a.pts)
    setLeagueMembersData(scored)
    setView('detail')
  }

  const inviteLink = selectedLeague ? `https://approde.vercel.app?liga=${selectedLeague.invite_code}` : ''

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000000dd', zIndex: 300, overflowY: 'auto', padding: '20px 16px' }}>
      <div style={{ background: '#111827', borderRadius: 20, width: '100%', maxWidth: 520, margin: '0 auto', border: '1px solid #1e2535' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {view !== 'list' && <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: '#f7c948', cursor: 'pointer', fontSize: 20 }}>←</button>}
            <div style={{ fontWeight: 800, fontSize: 18, color: '#fff' }}>
              🏘️ {view === 'list' ? 'Mis Ligas' : view === 'create' ? 'Nueva Liga' : view === 'join' ? 'Unirse a Liga' : selectedLeague?.name}
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#1e2535', border: 'none', color: '#8892a0', borderRadius: 8, padding: '8px 14px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ padding: 20 }}>
          {msg && <div style={{ background: '#00e5a022', color: '#00e5a0', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>{msg}</div>}

          {/* LIST */}
          {view === 'list' && (
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <button onClick={() => setView('create')} style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'linear-gradient(90deg,#f7c948,#ff6b35)', color: '#0a0e1a', fontWeight: 700 }}>+ Crear liga</button>
                <button onClick={() => setView('join')} style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: '1px solid #1e2535', cursor: 'pointer', background: 'none', color: '#8892a0', fontWeight: 700 }}>Unirse</button>
              </div>
              {leagues.length === 0 && <div style={{ textAlign: 'center', color: '#4a5568', padding: 30 }}>No estás en ninguna liga todavía.</div>}
              {leagues.map(l => (
                <div key={l.id} onClick={() => openLeague(l)} style={{ ...{ background: '#0d1117', border: '1px solid #1e2535', borderRadius: 12, padding: 16, marginBottom: 10, cursor: 'pointer' } }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{l.name}</div>
                      <div style={{ color: '#4a5568', fontSize: 12, marginTop: 2 }}>Código: {l.invite_code}</div>
                    </div>
                    <span style={{ color: '#f7c948', fontSize: 18 }}>›</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CREATE */}
          {view === 'create' && (
            <div>
              <label style={{ color: '#8892a0', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Nombre de la liga</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ej: Los del trabajo"
                style={{ width: '100%', marginTop: 8, marginBottom: 20, padding: '13px 16px', background: '#0d1117', border: '1px solid #1e2535', borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              <button onClick={createLeague} disabled={loading} style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'linear-gradient(90deg,#f7c948,#ff6b35)', color: '#0a0e1a', fontWeight: 800, fontSize: 15 }}>
                {loading ? 'Creando...' : '🏘️ Crear liga'}
              </button>
            </div>
          )}

          {/* JOIN */}
          {view === 'join' && (
            <div>
              <label style={{ color: '#8892a0', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Código o link de invitación</label>
              <input value={joinCode} onChange={e => setJoinCode(e.target.value.replace(/.*liga=/, ''))} placeholder="ABC123"
                style={{ width: '100%', marginTop: 8, marginBottom: 20, padding: '13px 16px', background: '#0d1117', border: '1px solid #1e2535', borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              <button onClick={joinLeague} disabled={loading} style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 800, fontSize: 15 }}>
                {loading ? 'Uniéndome...' : '🔗 Unirse a la liga'}
              </button>
            </div>
          )}

          {/* DETAIL */}
          {view === 'detail' && selectedLeague && (
            <div>
              {/* Invite link */}
              <div style={{ background: '#0d1117', borderRadius: 12, padding: 14, marginBottom: 16, border: '1px solid #1e2535' }}>
                <div style={{ color: '#4a5568', fontSize: 12, marginBottom: 8 }}>🔗 Link de invitación</div>
                <div style={{ color: '#f7c948', fontSize: 13, wordBreak: 'break-all', marginBottom: 10 }}>{inviteLink}</div>
                <button onClick={async () => {
                  if (navigator.share) await navigator.share({ text: `Unite a mi liga "${selectedLeague.name}" en APProde:\n${inviteLink}` })
                  else { navigator.clipboard.writeText(inviteLink); setMsg('Link copiado') }
                }} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', background: '#25D366', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                  📤 Compartir invitación
                </button>
              </div>

              {/* Ranking */}
              <div style={{ fontWeight: 700, color: '#8892a0', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
                Ranking · {leagueMembersData.length} jugadores
              </div>
              {leagueMembersData.map((row, i) => (
                <div key={row.alias} style={{ background: '#0d1117', border: `1px solid ${row.alias === myAlias ? '#f7c94844' : '#1e2535'}`, borderRadius: 12, padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: i === 0 ? '#f7c948' : i === 1 ? '#b0bec5' : i === 2 ? '#cd7f32' : '#1e2535', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: i < 3 ? '#0a0e1a' : '#4a5568', flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ fontSize: 22 }}>{row.avatar}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: row.alias === myAlias ? '#f7c948' : '#fff', fontSize: 14 }}>{row.alias}</div>
                    <div style={{ color: '#4a5568', fontSize: 11 }}>{row.played} partidos</div>
                  </div>
                  <ScoreBadge pts={row.pts} />
                  {selectedLeague.owner_alias === myAlias && row.alias !== myAlias && (
                    <button onClick={async () => {
                      if (!confirm(`¿Eliminar a ${row.alias} de la liga?`)) return
                      await db.removeMember(selectedLeague.id, row.alias)
                      setLeagueMembersData(prev => prev.filter(r => r.alias !== row.alias))
                    }} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}>✕</button>
                  )}
                </div>
              ))}

              {/* Admin: rename league */}
              {selectedLeague.owner_alias === myAlias && (
                <div style={{ marginTop: 16, background: '#0d1117', borderRadius: 12, padding: 14, border: '1px solid #ff6b3533' }}>
                  <div style={{ color: '#ff6b35', fontWeight: 700, fontSize: 12, marginBottom: 10 }}>⚙ Admin de liga</div>
                  <input
                    defaultValue={selectedLeague.name}
                    onBlur={async (e) => {
                      if (e.target.value.trim() && e.target.value !== selectedLeague.name) {
                        await db.renameLeague(selectedLeague.id, e.target.value.trim())
                        setSelectedLeague(prev => ({ ...prev, name: e.target.value.trim() }))
                        setMsg('Liga renombrada ✓')
                      }
                    }}
                    style={{ width: '100%', padding: '10px 14px', background: '#1e2535', border: '1px solid #2a3040', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                  <div style={{ color: '#4a5568', fontSize: 11, marginTop: 6 }}>Editá el nombre y tocá fuera para guardar</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── SHARE CARD ───────────────────────────────────────────────────────────────

function ShareModal({ match, pred, myScore, alias, official, onClose }) {
  const [copied, setCopied] = useState(false)

  const predStr = `${pred.home ?? '?'}-${pred.away ?? '?'}`
  const shareUrl = `https://approde.vercel.app`
  const homeFlag = FLAG_EMOJIS[match.home] || ''
  const awayFlag = FLAG_EMOJIS[match.away] || ''
  const resultText = official ? ` (resultado oficial: ${official.home}-${official.away})` : ''

  const whatsappText = `⚽ *APProde 2026*\n\nPronostiqué *${pred.home ?? '?'} – ${pred.away ?? '?'}* para ${homeFlag} *${match.home}* vs *${match.away}* ${awayFlag}${resultText}\n\nMi puntaje actual: *${myScore} pts*\n\n🏆 ¿Te animás a competir? Entrá al prode:\n${shareUrl}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`

  function copyLink() {
    navigator.clipboard.writeText(whatsappText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000000dd', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#111827', borderRadius: 20, padding: 24, width: '100%', maxWidth: 420, border: '1px solid #1e2535' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>📤 Compartir pronóstico</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4a5568', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>

        {/* Preview card */}
        <div style={{ background: '#0d1117', borderRadius: 16, padding: 20, marginBottom: 20, border: '1px solid #1e2535' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <img src={LOGO_SRC} alt="APPro" style={{ height: 22 }} />
            <span style={{ color: '#4a5568', fontSize: 12 }}>Mundial 2026</span>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', marginBottom: 6 }}>
              {homeFlag} {match.home} vs {match.away} {awayFlag}
            </div>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#f7c948', lineHeight: 1 }}>
              {pred.home ?? '?'} – {pred.away ?? '?'}
            </div>
            <div style={{ color: '#4a5568', fontSize: 12, marginTop: 6 }}>Mi pronóstico</div>
            {official && (
              <div style={{ color: '#00e5a0', fontSize: 13, marginTop: 6, fontWeight: 700 }}>
                Oficial: {official.home} – {official.away}
              </div>
            )}
          </div>
          <div style={{ borderTop: '1px solid #1e2535', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#8892a0', fontSize: 13 }}>@{alias}</span>
            <span style={{ color: '#f7c948', fontWeight: 700, fontSize: 13 }}>{myScore} pts</span>
          </div>
        </div>

        {/* Share buttons */}
        <button onClick={async () => {
          if (navigator.share) {
            try {
              await navigator.share({ text: whatsappText })
            } catch {}
          } else {
            window.open(whatsappUrl, '_blank')
          }
        }} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          width: '100%', padding: '15px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(90deg,#f7c948,#ff6b35)', color: '#0a0e1a',
          fontWeight: 800, fontSize: 15, marginBottom: 10, boxSizing: 'border-box',
        }}>
          <span style={{ fontSize: 20 }}>📤</span> Compartir
        </button>

        <button onClick={copyLink} style={{
          width: '100%', padding: '13px 0', borderRadius: 12, border: '1px solid #1e2535',
          cursor: 'pointer', background: copied ? '#00e5a022' : 'none',
          color: copied ? '#00e5a0' : '#8892a0', fontWeight: 600, fontSize: 14,
        }}>
          {copied ? '✓ Copiado' : '📋 Copiar texto'}
        </button>

        <p style={{ color: '#2a3040', fontSize: 11, textAlign: 'center', marginTop: 12, marginBottom: 0 }}>
          El mensaje incluye el link para que otros se registren en APProde
        </p>
      </div>
    </div>
  )
}

// ─── MATCH REACTION PICKER ────────────────────────────────────────────────────
function MatchReactionPicker({ matchId, myAlias, toAlias, reactions, onReact }) {
  const [showPicker, setShowPicker] = useState(false)
  const matchReactions = reactions.filter(r => r.match_id === matchId)
  const counts = matchReactions.reduce((acc, r) => { acc[r.emoji] = (acc[r.emoji] || 0) + 1; return acc }, {})
  const myReaction = matchReactions.find(r => r.from_alias === myAlias)?.emoji
  const isSelf = myAlias === toAlias

  return (
    <div style={{ padding: '0 14px 10px', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      {Object.entries(counts).map(([emoji, count]) => (
        <button key={emoji} onClick={() => !isSelf && onReact(matchId, emoji)} style={{
          background: myReaction === emoji ? '#f7c94822' : '#1e2535',
          border: `1px solid ${myReaction === emoji ? '#f7c948' : '#2a3040'}`,
          borderRadius: 20, padding: '3px 10px', cursor: isSelf ? 'default' : 'pointer',
          fontSize: 13, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 4,
        }}>{emoji} <span style={{ fontSize: 11, color: '#4a5568' }}>{count}</span></button>
      ))}
      {!isSelf && (
        <>
          <button onClick={() => setShowPicker(p => !p)} style={{
            background: '#1e2535', border: '1px solid #2a3040', borderRadius: 20,
            padding: '3px 10px', cursor: 'pointer', fontSize: 13, color: '#4a5568',
          }}>{myReaction || '+'}</button>
          {showPicker && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', width: '100%', marginTop: 4 }}>
              {REACTION_EMOJIS.map(e => (
                <button key={e} onClick={() => { onReact(matchId, e); setShowPicker(false) }} style={{
                  fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                }}>{e}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
function PlayerProfile({ alias, myAlias, officialResults, onClose, onChallenge }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reactions, setReactions] = useState([])
  const [challenges, setChallenges] = useState([])

  useEffect(() => {
    Promise.all([
      db.getUserProfile(alias),
      db.getPlayerReactions(alias),
      db.getChallenges(alias),
    ]).then(([p, r, c]) => {
      // Ensure default values for columns that may not exist on older users
      if (p) {
        p.avatar = p.avatar || '⚽'
        p.bonus_points = p.bonus_points || 0
        p.predictions = p.predictions || {}
      }
      setProfile(p)
      setReactions(r)
      setChallenges(c || [])
      setLoading(false)
    }).catch((e) => {
      console.error('Error loading profile:', e)
      setLoading(false)
    })
  }, [alias])

  async function reactToMatch(matchId, emoji) {
    if (alias === myAlias) return // no reaccionar a uno mismo
    await db.setPlayerReaction(alias, myAlias, matchId, emoji)
    const fresh = await db.getPlayerReactions(alias)
    setReactions(fresh)
  }

  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, background: '#000000dd', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#fff', fontSize: 18 }}>Cargando...</div>
    </div>
  )

  if (!profile) return (
    <div style={{ position: 'fixed', inset: 0, background: '#000000dd', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ color: '#ff6b6b', fontSize: 16 }}>No se pudo cargar el perfil</div>
      <button onClick={onClose} style={{ background: '#1e2535', border: 'none', color: '#fff', borderRadius: 10, padding: '10px 20px', cursor: 'pointer' }}>Cerrar</button>
    </div>
  )

  const pts = profile ? calcScore(profile.predictions, officialResults, profile.bonus_points) : 0
  const playedMatches = MATCHES.filter(m => {
    const pred = profile?.predictions?.[m.id]
    return pred && pred.home !== undefined && pred.away !== undefined
  })

  // Resumen: desglose de puntos por partido (solo los que ya tienen resultado oficial)
  const matchBreakdown = playedMatches.map(m => {
    const pred = profile.predictions[m.id]
    const off = officialResults[m.id]
    if (!off) return null
    const predRes = pred.home > pred.away ? 'H' : pred.home < pred.away ? 'A' : 'D'
    const offRes = off.home > off.away ? 'H' : off.home < off.away ? 'A' : 'D'
    let p = 0
    if (predRes === offRes) p += 1
    if (pred.home === off.home && pred.away === off.away) p += 3
    if (p === 0) return null
    return { match: m, pts: p }
  }).filter(Boolean).sort((a, b) => b.pts - a.pts)

  const top20 = matchBreakdown.slice(0, 20)
  const droppedExtra = matchBreakdown.slice(20)
  const matchPtsTotal = top20.reduce((s, x) => s + x.pts, 0)

  // Resumen: desafíos resueltos que afectan el bonus de este jugador
  const resolvedChallenges = challenges.filter(c => c.status === 'resolved' && c.winner_alias && c.winner_alias !== 'tie')
  const challengeBreakdown = resolvedChallenges.map(c => {
    const rival = c.from_alias === alias ? c.to_alias : c.from_alias
    const won = c.winner_alias === alias
    const m = MATCHES.find(mm => mm.id === parseInt(c.match_id))
    return { rival, won, match: m, id: c.id }
  })

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000000dd', zIndex: 300, overflowY: 'auto', padding: '20px 16px' }}>
      <div style={{ background: '#111827', borderRadius: 20, width: '100%', maxWidth: 600, margin: '0 auto', border: '1px solid #1e2535' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: 6 }}>👤 {alias}</div>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{profile?.avatar || '⚽'}</div>
            <ScoreBadge pts={pts} />
            {(profile?.bonus_points || 0) !== 0 && (
              <span style={{ marginLeft: 8, color: profile.bonus_points > 0 ? '#f7c948' : '#ff6b6b', fontSize: 12 }}>
                {profile.bonus_points > 0 ? '+' : ''}{profile.bonus_points} bonus
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {myAlias !== alias && (
              <button onClick={() => onChallenge(alias)} style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', border: 'none', color: '#fff', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>⚔️ Desafiar</button>
            )}
            <button onClick={onClose} style={{ background: '#1e2535', border: 'none', color: '#8892a0', borderRadius: 10, padding: '8px 14px', cursor: 'pointer' }}>✕</button>
          </div>
        </div>
        <div style={{ padding: 20 }}>
          {/* Resumen del puntaje */}
          {(matchBreakdown.length > 0 || challengeBreakdown.length > 0) && (
            <div style={{ marginBottom: 16, background: '#0d1117', border: '1px solid #1e2535', borderRadius: 12, padding: 14 }}>
              <div style={{ color: '#4a5568', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>📋 Resumen del puntaje</div>

              {top20.length > 0 && (
                <>
                  <div style={{ color: '#8892a0', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Pronósticos: <span style={{ color: '#00e5a0' }}>+{matchPtsTotal} pts</span></div>
                  {top20.map(({ match, pts: p }) => (
                    <div key={match.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8892a0', padding: '3px 0' }}>
                      <span>{match.home} vs {match.away}</span>
                      <span style={{ color: p === 4 ? '#00e5a0' : '#f7c948', fontWeight: 700 }}>{p === 4 ? '⭐ +4' : '+1'}</span>
                    </div>
                  ))}
                  {droppedExtra.length > 0 && (
                    <div style={{ fontSize: 11, color: '#4a5568', marginTop: 4 }}>
                      + {droppedExtra.length} acierto(s) más no contabilizado(s) (solo cuentan los mejores 20)
                    </div>
                  )}
                </>
              )}

              {challengeBreakdown.length > 0 && (
                <>
                  <div style={{ color: '#8892a0', fontSize: 12, fontWeight: 700, margin: '10px 0 6px' }}>
                    Desafíos: <span style={{ color: (profile.bonus_points || 0) >= 0 ? '#f7c948' : '#ff6b6b' }}>{(profile.bonus_points || 0) >= 0 ? '+' : ''}{profile.bonus_points || 0} pts</span>
                  </div>
                  {challengeBreakdown.map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8892a0', padding: '3px 0' }}>
                      <span>vs {c.rival}{c.match ? ` (${c.match.home} vs ${c.match.away})` : ''}</span>
                      <span style={{ color: c.won ? '#00e5a0' : '#ff6b6b', fontWeight: 700 }}>{c.won ? '🏆 +1' : '😔 -1'}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Badges */}
          {(() => {
            const played = playedMatches.length
            const badges = calcBadges(profile?.predictions || {}, officialResults, played)
            if (badges.length === 0) return null
            return (
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#4a5568', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Logros</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {badges.map(b => (
                    <div key={b.id} style={{ background: '#0d1117', border: '1px solid #f7c94833', borderRadius: 10, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 18 }}>{b.emoji}</span>
                      <div>
                        <div style={{ color: '#f7c948', fontWeight: 700, fontSize: 12 }}>{b.label}</div>
                        <div style={{ color: '#4a5568', fontSize: 10 }}>{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Predictions */}
          <div style={{ fontWeight: 700, color: '#8892a0', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Pronósticos ({playedMatches.length}/{MATCHES.length})</div>
          {playedMatches.map(match => {
            const pred = profile.predictions[match.id]
            const off = officialResults[match.id]
            const predRes = pred.home > pred.away ? 'H' : pred.home < pred.away ? 'A' : 'D'
            const offRes = off ? (off.home > off.away ? 'H' : off.home < off.away ? 'A' : 'D') : null
            const correct = off && predRes === offRes
            const exact = off && pred.home === off.home && pred.away === off.away
            return (
              <div key={match.id} style={{ background: '#0d1117', borderRadius: 10, marginBottom: 8, border: `1px solid ${exact ? '#00e5a033' : correct ? '#f7c94833' : '#1e2535'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}>
                  <span style={{ fontSize: 12, color: '#8892a0', flex: 1 }}><Flag team={match.home} size={14}/> {match.home}</span>
                  <span style={{ fontWeight: 800, color: '#fff', fontSize: 15, margin: '0 12px' }}>{pred.home} – {pred.away}</span>
                  <span style={{ fontSize: 12, color: '#8892a0', flex: 1, textAlign: 'right' }}>{match.away} <Flag team={match.away} size={14}/></span>
                  <span style={{ marginLeft: 8, fontSize: 14 }}>{exact ? '⭐' : correct ? '✓' : off ? '✗' : ''}</span>
                </div>
                <MatchReactionPicker
                  matchId={match.id}
                  myAlias={myAlias}
                  toAlias={alias}
                  reactions={reactions}
                  onReact={reactToMatch}
                />
              </div>
            )
          })}
          {playedMatches.length === 0 && <div style={{ color: '#2a3040', textAlign: 'center', padding: 20 }}>Sin pronósticos aún</div>}
        </div>
      </div>
    </div>
  )
}

// ─── CHALLENGE MODAL ──────────────────────────────────────────────────────────
function ChallengeModal({ myAlias, toAlias, predictions, officialResults, onClose, onSend }) {
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const availableMatches = MATCHES.filter(m => {
    const pred = predictions[m.id]
    const kickoffMs = m.kickoff ? new Date(m.kickoff).getTime() : null
    const notStarted = kickoffMs && Date.now() < kickoffMs + 10 * 60 * 1000
    return pred && pred.home !== undefined && notStarted && !officialResults[m.id]
  })

  async function sendChallenge() {
    if (!selectedMatch) return
    setSending(true)
    try {
      await db.createChallenge(myAlias, toAlias, selectedMatch.id)
      setSent(true)
      onSend()
    } catch { setSending(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000000dd', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#111827', borderRadius: 20, width: '100%', maxWidth: 440, maxHeight: '85vh', border: '1px solid #6366f144', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>⚔️ Desafiar a {toAlias}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4a5568', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
          <p style={{ color: '#8892a0', fontSize: 13, marginBottom: 16 }}>El ganador suma <strong style={{ color: '#f7c948' }}>+1 punto</strong> y el perdedor pierde <strong style={{ color: '#ff6b6b' }}>-1 punto</strong>. Solo podés desafiar en partidos que ya pronosticaste y que no empezaron.</p>
          {availableMatches.length === 0 && <div style={{ color: '#4a5568', textAlign: 'center', padding: 20 }}>No tenés partidos disponibles para desafiar.</div>}
          {availableMatches.map(match => (
            <div key={match.id} onClick={() => setSelectedMatch(match)} style={{
              padding: '12px 16px', borderRadius: 12, marginBottom: 8, cursor: 'pointer',
              background: selectedMatch?.id === match.id ? '#1a1030' : '#0d1117',
              border: `1px solid ${selectedMatch?.id === match.id ? '#6366f1' : '#1e2535'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#e2e8f0' }}><Flag team={match.home} size={14}/> {match.home} vs {match.away} <Flag team={match.away} size={14}/></span>
                <span style={{ color: '#4a5568', fontSize: 11 }}>{match.kickoff ? localDate(match.kickoff) : match.date} · {localTime(match.kickoff)}</span>
              </div>
              {predictions[match.id] && (
                <div style={{ color: '#6366f1', fontSize: 12, marginTop: 4 }}>
                  Tu pronóstico: {predictions[match.id].home} – {predictions[match.id].away}
                </div>
              )}
            </div>
          ))}
          {sent && (
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <div style={{ color: '#00e5a0', fontWeight: 700, marginBottom: 12 }}>✓ ¡Desafío enviado!</div>
              <button
                onClick={async () => {
                  const text = `⚔️ *APProde 2026*\n\nTe desafié a ${toAlias} en ${selectedMatch ? `${selectedMatch.home} vs ${selectedMatch.away}` : 'un partido'} 🔥\n\nEl que acierte mejor gana +1 punto (y el otro pierde -1). ¡Entrá a aceptar el desafío!\n\nhttps://approde.vercel.app`
                  if (navigator.share) {
                    try { await navigator.share({ text }) } catch {}
                  } else {
                    window.location.href = `https://wa.me/?text=${encodeURIComponent(text)}`
                  }
                }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', cursor: 'pointer',
                  background: '#25D366', color: '#fff', fontWeight: 700, fontSize: 13,
                  padding: '10px 18px', borderRadius: 12,
                }}
              >📲 Avisar por WhatsApp</button>
              <div style={{ marginTop: 12 }}>
                <button onClick={onClose} style={{ background: 'none', border: '1px solid #1e2535', color: '#8892a0', borderRadius: 10, padding: '8px 18px', cursor: 'pointer', fontSize: 13 }}>Cerrar</button>
              </div>
            </div>
          )}
        </div>
        {!sent && availableMatches.length > 0 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #1e2535', flexShrink: 0 }}>
            <button onClick={sendChallenge} disabled={!selectedMatch || sending} style={{
              width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: selectedMatch ? 'linear-gradient(90deg,#6366f1,#8b5cf6)' : '#1e2535',
              color: '#fff', fontWeight: 800, fontSize: 15, opacity: sending ? 0.7 : 1,
            }}>{sending ? 'Enviando...' : '⚔️ Enviar desafío'}</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── LOCAL TIME HELPER ────────────────────────────────────────────────────────
function localTime(kickoff) {
  if (!kickoff) return ''
  return new Date(kickoff).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}
function localDate(kickoff) {
  if (!kickoff) return ''
  return new Date(kickoff).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

// ─── VOICE HELPER ─────────────────────────────────────────────────────────────
const WORDS_TO_NUM = {
  'cero':0,'zero':0,'un':1,'uno':1,'one':1,'dos':2,'two':2,'tres':3,'three':3,
  'cuatro':4,'four':4,'cinco':5,'five':5,'seis':6,'six':6,'siete':7,'seven':7,
  'ocho':8,'eight':8,'nueve':9,'nine':9,'diez':10,'ten':10,'once':11,'eleven':11,
  'doce':12,'twelve':12,'trece':13,'catorce':14,'quince':15,
}

// Apodos / formas habladas alternativas para equipos con nombres compuestos o que
// el reconocimiento de voz puede transcribir distinto al nombre oficial.
const TEAM_VOICE_ALIASES = {
  'EE.UU.': ['estados unidos', 'eeuu', 'ee uu', 'usa'],
  'Corea del Sur': ['corea del sur', 'corea'],
  'Países Bajos': ['paises bajos', 'holanda'],
  'Rep. Checa': ['republica checa', 'rep checa', 'chequia', 'checa'],
  'Costa de Marfil': ['costa de marfil', 'marfil'],
  'Arabia Saudita': ['arabia saudita', 'arabia', 'saudita'],
  'Nueva Zelanda': ['nueva zelanda', 'zelanda'],
  'Bosnia': ['bosnia', 'bosnia herzegovina'],
  'Cabo Verde': ['cabo verde'],
  'RD Congo': ['rd congo', 'congo', 'republica democratica del congo', 'r d congo'],
}

function stripAccents(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// Devuelve la lista de formas habladas posibles (normalizadas, sin acentos) para un equipo
function teamVoiceForms(teamName) {
  const forms = [stripAccents(teamName.toLowerCase()).replace(/\./g, '')]
  if (TEAM_VOICE_ALIASES[teamName]) {
    TEAM_VOICE_ALIASES[teamName].forEach(a => forms.push(stripAccents(a.toLowerCase())))
  }
  return forms
}

// Busca la posición (índice de palabra) donde aparece el nombre del equipo en el transcript
function findTeamIndex(tokens, teamName) {
  const forms = teamVoiceForms(teamName)
  for (const form of forms) {
    const formWords = form.split(/\s+/)
    for (let i = 0; i <= tokens.length - formWords.length; i++) {
      if (formWords.every((w, j) => tokens[i + j] === w)) return i + formWords.length - 1
    }
  }
  return -1
}

function parseVoiceScore(transcript, homeTeam, awayTeam) {
  const t = stripAccents(transcript.toLowerCase().trim())
  const tokens = t.split(/\s+/)

  // Extraer todos los números mencionados con su posición
  const numTokens = []
  tokens.forEach((w, i) => {
    const n = WORDS_TO_NUM[w] ?? (/^\d+$/.test(w) ? parseInt(w) : NaN)
    if (!isNaN(n)) numTokens.push({ index: i, value: n })
  })

  // Intentar emparejar por nombre de equipo: el número más cercano DESPUÉS de
  // la mención de cada equipo le corresponde a ese equipo.
  if (numTokens.length >= 2 && homeTeam && awayTeam) {
    const homeIdx = findTeamIndex(tokens, homeTeam)
    const awayIdx = findTeamIndex(tokens, awayTeam)
    if (homeIdx >= 0 && awayIdx >= 0) {
      const closestAfter = (pos) => numTokens.filter(n => n.index > pos).sort((a, b) => a.index - b.index)[0]
      const homeNum = closestAfter(homeIdx)
      const awayNum = closestAfter(awayIdx)
      if (homeNum && awayNum && homeNum.index !== awayNum.index) {
        return { home: homeNum.value, away: awayNum.value }
      }
    }
  }

  // Sin nombres de equipo reconocidos: usar los dos primeros números en orden
  // (asume "local primero, visitante segundo", como antes)
  if (numTokens.length >= 2) return { home: numTokens[0].value, away: numTokens[1].value }
  return null
}

// ─── MATCH CARD ───────────────────────────────────────────────────────────────
function MatchCard({ match, predictions, officialResults, setPred, S, showGroup = false }) {
  const pred = predictions[match.id] || {}
  const off = officialResults[match.id]
  const now = Date.now()
  const kickoffMs = match.kickoff ? new Date(match.kickoff).getTime() : null
  const isLocked = off || (kickoffMs && now > kickoffMs + 10 * 60 * 1000)
  const isInPlay = kickoffMs && now >= kickoffMs && !off
  const minutesLeftToEdit = isInPlay && !isLocked ? Math.ceil((kickoffMs + 10 * 60 * 1000 - now) / 60000) : null
  const isKickoffSoon = kickoffMs && now > kickoffMs - 30 * 60 * 1000 && now < kickoffMs
  const hasOfficial = !!off
  const [listening, setListening] = useState(false)
  const [voiceMsg, setVoiceMsg] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState(null)

  async function getAIPrediction() {
    setAiLoading(true)
    setAiSuggestion(null)
    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 800,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
          messages: [{
            role: 'user',
            content: `Pronóstico Mundial 2026: ${match.home} vs ${match.away}. Considerá ranking FIFA, forma reciente y contexto. Buscá info breve y respondé YA.

Responder SOLO con este JSON, sin texto adicional:
{"home": 2, "away": 1, "reasoning": "máx 2 oraciones en español"}`
          }]
        }),
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error))
      const text = data.content?.find(b => b.type === 'text')?.text || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const jsonMatch = clean.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('La IA no devolvió una respuesta a tiempo. Probá de nuevo.')
      const result = JSON.parse(jsonMatch[0])
      setAiSuggestion(result)
    } catch (e) {
      const friendly = /rate.?limit|10,?000|tokens per minute/i.test(e.message)
        ? '⏳ Mucha demanda en este momento. Probá de nuevo en 1-2 minutos.'
        : 'No se pudo obtener una sugerencia ahora. Probá de nuevo en unos minutos.'
      setAiSuggestion({ error: friendly, detail: e.message })
    }
    setAiLoading(false)
  }

  function applyAISuggestion() {
    if (!aiSuggestion || aiSuggestion.error) return
    setPred(match.id, 'home', String(aiSuggestion.home))
    setPred(match.id, 'away', String(aiSuggestion.away))
    setAiSuggestion(null)
  }

  let predResult = null, offResult = null
  if (pred.home !== undefined && pred.away !== undefined)
    predResult = pred.home > pred.away ? 'H' : pred.home < pred.away ? 'A' : 'D'
  if (off) offResult = off.home > off.away ? 'H' : off.home < off.away ? 'A' : 'D'
  const correct = off && predResult === offResult
  const exact = off && pred.home === off.home && pred.away === off.away

  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { setVoiceMsg('Tu navegador no soporta voz'); setTimeout(() => setVoiceMsg(''), 2500); return }
    const rec = new SpeechRecognition()
    rec.lang = 'es-AR'
    rec.interimResults = false
    rec.maxAlternatives = 3
    setListening(true)
    setVoiceMsg('🎙 Escuchando...')
    rec.onresult = (e) => {
      const transcripts = Array.from(e.results[0]).map(r => r.transcript)
      let parsed = null
      for (const t of transcripts) { parsed = parseVoiceScore(t, match.home, match.away); if (parsed) break }
      if (parsed) {
        setPred(match.id, 'home', String(parsed.home))
        setPred(match.id, 'away', String(parsed.away))
        setVoiceMsg(`✓ ${parsed.home} - ${parsed.away}`)
      } else {
        setVoiceMsg(`No entendí "${transcripts[0]}"`)
      }
      setTimeout(() => setVoiceMsg(''), 2500)
      setListening(false)
    }
    rec.onerror = () => { setVoiceMsg('Error de micrófono'); setListening(false); setTimeout(() => setVoiceMsg(''), 2500) }
    rec.onend = () => setListening(false)
    rec.start()
  }

  return (
    <div style={{ ...S.card, borderColor: exact ? '#00e5a044' : correct ? '#f7c94844' : '#1e2535' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ color: '#4a5568', fontSize: 11 }}>
          {showGroup ? `Grupo ${match.group} · ` : ''}{match.kickoff ? localDate(match.kickoff) : match.date}
          {match.kickoff && <span style={{ color: isKickoffSoon ? '#f7c948' : '#4a5568', fontWeight: isKickoffSoon ? 700 : 400 }}> · {localTime(match.kickoff)}</span>}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isInPlay && <span style={{ background: '#00e5a022', color: '#00e5a0', borderRadius: 10, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>🔴 En juego</span>}
          {isKickoffSoon && <span style={{ background: '#f7c94822', color: '#f7c948', borderRadius: 10, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>⏰ ¡Pronto!</span>}
          {exact && <span style={{ color: '#00e5a0', fontSize: 12, fontWeight: 700 }}>⭐ Exacto +3</span>}
          {correct && !exact && <span style={{ color: '#f7c948', fontSize: 12, fontWeight: 700 }}>✓ Resultado +1</span>}
          {hasOfficial && !correct && predResult !== null && <span style={{ color: '#ff6b6b', fontSize: 12 }}>✗ Sin puntos</span>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}><Flag team={match.home} /> {match.home}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="number" min="0" max="20" style={{...S.input, opacity: isLocked ? 0.5 : 1}} value={pred.home ?? ''} onChange={e => setPred(match.id, 'home', e.target.value)} disabled={isLocked} placeholder="–" />
          <span style={{ color: '#4a5568', fontWeight: 700 }}>:</span>
          <input type="number" min="0" max="20" style={{...S.input, opacity: isLocked ? 0.5 : 1}} value={pred.away ?? ''} onChange={e => setPred(match.id, 'away', e.target.value)} disabled={isLocked} placeholder="–" />
        </div>
        <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}><Flag team={match.away} /> {match.away}</div>
      </div>
      {minutesLeftToEdit !== null && (
        <div style={{ textAlign: 'center', marginTop: 8, color: '#00e5a0', fontSize: 11 }}>
          🔴 ¡Ya arrancó! Podés editar {minutesLeftToEdit} min más
        </div>
      )}
      {!isLocked && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          <button onClick={startVoice} disabled={listening} style={{
            background: listening ? '#6366f1' : '#1e2535',
            border: `1px solid ${listening ? '#6366f1' : '#2a3040'}`,
            borderRadius: 20, padding: '5px 14px', cursor: 'pointer',
            color: listening ? '#fff' : '#8892a0', fontSize: 12,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 14 }}>{listening ? '🔴' : '🎙'}</span>
            {listening ? 'Escuchando...' : 'Dictar'}
          </button>
          {voiceMsg && <span style={{ fontSize: 12, color: voiceMsg.startsWith('✓') ? '#00e5a0' : '#ff6b6b' }}>{voiceMsg}</span>}
          <button onClick={getAIPrediction} disabled={aiLoading} style={{
            background: aiLoading ? '#1e2535' : '#0d1f2d',
            border: '1px solid #6366f144',
            borderRadius: 20, padding: '5px 14px', cursor: 'pointer',
            color: aiLoading ? '#4a5568' : '#a5b4fc', fontSize: 12,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 14 }}>🤖</span>
            {aiLoading ? 'Analizando...' : 'Sugerencia IA'}
          </button>
        </div>
      )}

      {/* AI Suggestion */}
      {aiSuggestion && !aiSuggestion.error && (
        <div style={{ marginTop: 10, background: '#0d1f2d', borderRadius: 10, padding: 12, border: '1px solid #6366f144' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#a5b4fc', fontSize: 12, fontWeight: 700 }}>🤖 Pronóstico IA: {aiSuggestion.home} – {aiSuggestion.away}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={applyAISuggestion} style={{ background: '#6366f1', border: 'none', color: '#fff', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>Usar</button>
              <button onClick={() => setAiSuggestion(null)} style={{ background: 'none', border: '1px solid #1e2535', color: '#4a5568', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 11 }}>✕</button>
            </div>
          </div>
          {aiSuggestion.reasoning && <div style={{ color: '#4a5568', fontSize: 11, lineHeight: 1.5 }}>{aiSuggestion.reasoning}</div>}
        </div>
      )}
      {aiSuggestion?.error && (
        <div style={{ marginTop: 8, textAlign: 'center' }}>
          <div style={{ color: '#ff6b6b', fontSize: 12 }}>{aiSuggestion.error}</div>
          {aiSuggestion.detail && <div style={{ color: '#3a4150', fontSize: 10, marginTop: 2 }}>{aiSuggestion.detail}</div>}
        </div>
      )}
      {hasOfficial && <div style={{ textAlign: 'center', marginTop: 10, color: '#4a5568', fontSize: 12 }}>Oficial: <strong style={{ color: '#fff' }}>{off.home} – {off.away}</strong></div>}
      {isInPlay && (
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <div style={{ color: '#00e5a0', fontSize: 11, marginBottom: 6 }}>🔴 Partido en juego — pronóstico cerrado</div>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(`${match.home} vs ${match.away} resultado en vivo`)}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none',
              background: '#1e2535', border: '1px solid #2a3040', borderRadius: 20,
              padding: '5px 14px', color: '#8892a0', fontSize: 12,
            }}
          >📊 Ver resultado en vivo</a>
        </div>
      )}
      {pred.home !== undefined && pred.away !== undefined && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button onClick={() => S.onShare && S.onShare(match)} style={{ background: 'none', border: '1px solid #1e2535', color: '#4a5568', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 11 }}>📤 Compartir</button>
        </div>
      )}
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
          <img src={LOGO_SRC} alt="APPro" style={{ height: 48, marginBottom: 8 }} />
          <div style={{ marginBottom: 16 }}>
            <span style={{ background: '#1e2535', color: '#f7c948', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 6, letterSpacing: 1 }}>BETA</span>
          </div>
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

// ─── CHALLENGES INBOX ─────────────────────────────────────────────────────────
function ChallengesInbox({ challenges, myAlias, officialResults, onAccept, onClose }) {
  const pending  = challenges.filter(c => c.to_alias === myAlias && c.status === 'pending')
  const sent     = challenges.filter(c => c.from_alias === myAlias && c.status === 'pending')
  const active   = challenges.filter(c => c.status === 'accepted')
  const resolved = challenges.filter(c => c.status === 'resolved')

  function matchName(matchId) {
    const m = MATCHES.find(m => m.id === parseInt(matchId))
    return m ? `${FLAG_EMOJIS[m.home] || ''} ${m.home} vs ${m.away} ${FLAG_EMOJIS[m.away] || ''}` : `Partido #${matchId}`
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000000dd', zIndex: 300, overflowY: 'auto', padding: '20px 16px' }}>
      <div style={{ background: '#111827', borderRadius: 20, width: '100%', maxWidth: 520, margin: '0 auto', border: '1px solid #6366f144' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#fff' }}>⚔️ Mis Desafíos</div>
          <button onClick={onClose} style={{ background: '#1e2535', border: 'none', color: '#8892a0', borderRadius: 8, padding: '8px 14px', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ padding: 20 }}>

          {/* Sent */}
          {sent.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: '#8892a0', fontWeight: 700, fontSize: 13, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
                📤 Enviados ({sent.length})
              </div>
              {sent.map(ch => (
                <div key={ch.id} style={{ background: '#0d1117', borderRadius: 12, padding: 14, marginBottom: 8, border: '1px solid #1e2535' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>Desafiaste a {ch.to_alias}</div>
                      <div style={{ color: '#4a5568', fontSize: 12, marginTop: 2 }}>{matchName(ch.match_id)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ background: '#f7c94822', color: '#f7c948', borderRadius: 10, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>⏳ Esperando</span>
                      <button onClick={() => onAccept(ch.id, 'cancel')} title="Cancelar desafío" style={{ background: 'none', border: '1px solid #2a3040', color: '#4a5568', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}>🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pending */}
          {pending.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: '#f7c948', fontWeight: 700, fontSize: 13, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
                🔔 Pendientes ({pending.length})
              </div>
              {pending.map(ch => (
                <div key={ch.id} style={{ background: '#0d1117', borderRadius: 12, padding: 16, marginBottom: 10, border: '1px solid #f7c94833' }}>
                  <div style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>{ch.from_alias} te desafió</div>
                  <div style={{ color: '#8892a0', fontSize: 13, marginBottom: 12 }}>{matchName(ch.match_id)}</div>
                  <div style={{ color: '#4a5568', fontSize: 12, marginBottom: 12 }}>El ganador suma <strong style={{ color: '#f7c948' }}>+1 punto bonus</strong></div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => onAccept(ch.id, 'accept')} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 700 }}>✓ Aceptar</button>
                    <button onClick={() => onAccept(ch.id, 'reject')} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: '1px solid #1e2535', cursor: 'pointer', background: 'none', color: '#4a5568', fontWeight: 700 }}>✗ Rechazar</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active */}
          {active.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: '#00e5a0', fontWeight: 700, fontSize: 13, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>⚡ En curso ({active.length})</div>
              {active.map(ch => {
                const rival = ch.from_alias === myAlias ? ch.to_alias : ch.from_alias
                const off = officialResults[ch.match_id]
                return (
                  <div key={ch.id} style={{ background: '#0d1117', borderRadius: 12, padding: 14, marginBottom: 8, border: '1px solid #00e5a022' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>vs {rival}</div>
                        <div style={{ color: '#4a5568', fontSize: 12 }}>{matchName(ch.match_id)}</div>
                      </div>
                      {off ? <span style={{ color: '#f7c948', fontSize: 12 }}>⏳ Calculando...</span>
                           : <span style={{ color: '#00e5a0', fontSize: 12 }}>🔴 En juego</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Resolved */}
          {resolved.length > 0 && (
            <div>
              <div style={{ color: '#4a5568', fontWeight: 700, fontSize: 13, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>Historial</div>
              {resolved.map(ch => {
                const rival = ch.from_alias === myAlias ? ch.to_alias : ch.from_alias
                const iWon = ch.winner_alias === myAlias
                const tie = ch.winner_alias === 'tie'
                return (
                  <div key={ch.id} style={{ background: '#0d1117', borderRadius: 12, padding: 14, marginBottom: 8, border: `1px solid ${iWon ? '#00e5a033' : tie ? '#1e2535' : '#ff6b6b22'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>vs {rival}</div>
                        <div style={{ color: '#4a5568', fontSize: 12 }}>{matchName(ch.match_id)}</div>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: 14, color: iWon ? '#00e5a0' : tie ? '#4a5568' : '#ff6b6b' }}>
                        {iWon ? '🏆 +1 pts' : tie ? '🤝 Empate' : '😔 -1 pts'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {challenges.length === 0 && (
            <div style={{ textAlign: 'center', color: '#4a5568', padding: 30 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>⚔️</div>
              Sin desafíos todavía. Desafiá a alguien desde el ranking.
            </div>
          )}        </div>
      </div>
    </div>
  )
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ official, onSave, onForceSync, isSyncing, aiSuggestions, onDismissSuggestion, onClose }) {
  const [localResults, setLocalResults] = useState({ ...(official?.results || {}) })
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
  function applySuggestion(matchId, result) {
    setLocalResults(prev => ({ ...prev, [matchId]: { home: result.home, away: result.away } }))
    const m = MATCHES.find(mm => mm.id === matchId)
    if (m) setActiveGroup(m.group)
    onDismissSuggestion(matchId)
  }

  async function handleSave() {
    setSaving(true)
    await onSave({ results: localResults })
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

          {/* Sugerencias de IA pendientes de confirmar */}
          {Object.keys(aiSuggestions || {}).length > 0 && (
            <div style={{ background: '#0d1f2d', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid #6366f144' }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 4 }}>🤖 La IA encontró estos resultados</div>
              <div style={{ color: '#4a5568', fontSize: 12, marginBottom: 10 }}>Revisalos y tocá "Aplicar" para cargarlos abajo. No se guardan solos.</div>
              {Object.entries(aiSuggestions).map(([id, r]) => {
                const m = MATCHES.find(mm => mm.id === parseInt(id))
                if (!m) return null
                return (
                  <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                    <span style={{ color: '#e2e8f0', fontSize: 13 }}>{m.home} {r.home} – {r.away} {m.away}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => applySuggestion(parseInt(id), r)} style={{ background: '#6366f1', border: 'none', color: '#fff', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>✓ Aplicar</button>
                      <button onClick={() => onDismissSuggestion(parseInt(id))} style={{ background: 'none', border: '1px solid #2a3040', color: '#4a5568', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>✕</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

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
// ─── KNOCKOUT SECTION ─────────────────────────────────────────────────────────
function KnockoutSection({ predictions, setPredictions }) {
  const ROUNDS = [
    {
      round: 'R32', label: '16avos de Final', date: '28 Jun – 3 Jul', icon: '⚡',
      matches: [
        { id: 'p73',  label: '2°A vs 2°B',           date: '28 Jun' },
        { id: 'p74',  label: '1°E vs 3°(A/B/C/D/F)', date: '29 Jun' },
        { id: 'p75',  label: '1°F vs 2°C',           date: '29 Jun' },
        { id: 'p76',  label: '1°C vs 2°F',           date: '29 Jun' },
        { id: 'p77',  label: '1°I vs 3°(C/D/F/G/H)', date: '30 Jun' },
        { id: 'p78',  label: '2°E vs 2°I',           date: '30 Jun' },
        { id: 'p79',  label: '1°A vs 3°(C/E/F/H/I)', date: '30 Jun' },
        { id: 'p80',  label: '1°L vs 3°(E/H/I/J/K)', date: '1 Jul'  },
        { id: 'p81',  label: '1°D vs 3°(B/E/F/I/J)', date: '1 Jul'  },
        { id: 'p82',  label: '1°G vs 3°(A/E/H/I/J)', date: '1 Jul'  },
        { id: 'p83',  label: '2°K vs 2°L',           date: '2 Jul'  },
        { id: 'p84',  label: '1°H vs 2°J',           date: '2 Jul'  },
        { id: 'p85',  label: '1°B vs 3°(E/F/G/I/J)', date: '2 Jul'  },
        { id: 'p86',  label: '1°J vs 2°H',           date: '3 Jul'  },
        { id: 'p87',  label: '1°K vs 3°(D/E/I/J/L)', date: '3 Jul'  },
        { id: 'p88',  label: '2°D vs 2°G',           date: '3 Jul'  },
      ],
    },
    {
      round: 'R16', label: 'Octavos de Final', date: '4 – 7 Jul', icon: '🔥',
      matches: [
        { id: 'p89', label: 'W73 vs W75', date: '4 Jul' },
        { id: 'p90', label: 'W74 vs W77', date: '4 Jul' },
        { id: 'p91', label: 'W76 vs W78', date: '5 Jul' },
        { id: 'p92', label: 'W79 vs W80', date: '5 Jul' },
        { id: 'p93', label: 'W83 vs W84', date: '6 Jul' },
        { id: 'p94', label: 'W81 vs W82', date: '6 Jul' },
        { id: 'p95', label: 'W86 vs W88', date: '7 Jul' },
        { id: 'p96', label: 'W85 vs W87', date: '7 Jul' },
      ],
    },
    {
      round: 'QF', label: 'Cuartos de Final', date: '9 – 11 Jul', icon: '💥',
      matches: [
        { id: 'p97',  label: 'W89 vs W90', date: '9 Jul'  },
        { id: 'p98',  label: 'W93 vs W94', date: '10 Jul' },
        { id: 'p99',  label: 'W91 vs W92', date: '11 Jul' },
        { id: 'p100', label: 'W95 vs W96', date: '11 Jul' },
      ],
    },
    {
      round: 'SF', label: 'Semifinales', date: '14 – 15 Jul', icon: '🌟',
      matches: [
        { id: 'p101', label: 'W97 vs W98',   date: '14 Jul' },
        { id: 'p102', label: 'W99 vs W100',  date: '15 Jul' },
      ],
    },
    {
      round: 'F', label: '🏆 Final', date: '19 Jul · MetLife Stadium', icon: '🏆',
      matches: [{ id: 'p104', label: 'W101 vs W102', date: '19 Jul' }],
    },
  ]

  return (
    <div>
      {ROUNDS.map(({ round, label, date, icon, matches }) => {
        const roundPreds = (predictions['knockout'] || {})[round] || {}
        const filled = Object.values(roundPreds).filter(Boolean).length
        return (
          <div key={round} style={{ background: '#111827', border: '1px solid #1e2535', borderRadius: 16, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>{label}</div>
                  <div style={{ color: '#4a5568', fontSize: 12 }}>{date}</div>
                </div>
              </div>
              <div style={{ color: filled === matches.length ? '#00e5a0' : '#4a5568', fontSize: 12, fontWeight: 700 }}>
                {filled}/{matches.length}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {matches.map(({ id, label: ml, date: md }) => {
                const val = roundPreds[id] || ''
                return (
                  <div key={id}>
                    <div style={{ color: '#4a5568', fontSize: 11, marginBottom: 4 }}>{ml} · {md}</div>
                    <select value={val}
                      onChange={e => {
                        const updated = { ...predictions }
                        if (!updated['knockout']) updated['knockout'] = {}
                        if (!updated['knockout'][round]) updated['knockout'][round] = {}
                        updated['knockout'][round][id] = e.target.value
                        setPredictions(updated)
                      }}
                      style={{ width: '100%', padding: '10px 14px', background: val ? '#0d1f0d' : '#0d1117', border: `1px solid ${val ? '#00e5a044' : '#1e2535'}`, borderRadius: 10, color: val ? '#00e5a0' : '#8892a0', fontSize: 14, outline: 'none' }}>
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
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('matches')
  const [predictions, setPredictions] = useState({})
  const [leaderboard, setLeaderboard] = useState([])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeGroup, setActiveGroup] = useState('A')

  const [official, setOfficial] = useState(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState({})

  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminPin, setAdminPin] = useState('')
  const [adminError, setAdminError] = useState('')
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  // Community state
  const [shareMatch, setShareMatch] = useState(null)
  const [viewingProfile, setViewingProfile] = useState(null)
  const [challengingAlias, setChallengingAlias] = useState(null)
  const [challenges, setChallenges] = useState([])
  const [showChallenges, setShowChallenges] = useState(false)
  const [showLeagues, setShowLeagues] = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  // Auto-join league from URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ligaCode = params.get('liga')
    if (ligaCode && user) {
      db.getLeagueByCode(ligaCode).then(league => {
        if (league) db.joinLeague(league.id, user.alias)
      })
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [user])

  // Load official results on mount + auto-sync cada 15 minutos
  useEffect(() => {
    loadOfficial()
    const interval = setInterval(runAutoSync, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (user) {
      setPredictions(user.predictions || {})
    }
  }, [user?.alias])

  // Re-resolver desafíos cada vez que cambian los resultados oficiales
  useEffect(() => {
    if (user && official) {
      loadChallenges(user.alias)
    }
  }, [user?.alias, official])

  useEffect(() => { if (tab === 'leaderboard') loadLeaderboard() }, [tab, official])

  async function loadChallenges(alias) {
    try {
      const data = await db.getChallenges(alias)
      setChallenges(data)
      // Auto-resolve challenges with official results
      for (const ch of data) {
        if (ch.status === 'accepted' && !ch.winner_alias) {
          const off = official?.results?.[ch.match_id]
          if (!off) continue
          // Get both users' predictions
          const fromUser = await db.getUserProfile(ch.from_alias)
          const toUser = await db.getUserProfile(ch.to_alias)
          const fromPred = fromUser?.predictions?.[ch.match_id]
          const toPred = toUser?.predictions?.[ch.match_id]
          if (!fromPred || !toPred) continue
          const offRes = off.home > off.away ? 'H' : off.home < off.away ? 'A' : 'D'
          const fromRes = fromPred.home > fromPred.away ? 'H' : fromPred.home < fromPred.away ? 'A' : 'D'
          const toRes = toPred.home > toPred.away ? 'H' : toPred.home < toPred.away ? 'A' : 'D'
          const fromCorrect = fromRes === offRes
          const toCorrect = toRes === offRes
          // Exact match beats result match
          const fromExact = fromPred.home === off.home && fromPred.away === off.away
          const toExact = toPred.home === off.home && toPred.away === off.away
          let winner = ''
          if (fromExact && !toExact) winner = ch.from_alias
          else if (toExact && !fromExact) winner = ch.to_alias
          else if (fromCorrect && !toCorrect) winner = ch.from_alias
          else if (toCorrect && !fromCorrect) winner = ch.to_alias
          // tie = no bonus
          if (winner) {
            const loser = winner === ch.from_alias ? ch.to_alias : ch.from_alias
            await supabase.from('challenges').update({ winner_alias: winner, status: 'resolved' }).eq('id', ch.id)
            await db.addBonusPoint(winner)
            await db.subtractBonusPoint(loser)
          } else {
            // Empate: ambos acertaron por igual (incluyendo el caso de que ambos fallaron)
            await supabase.from('challenges').update({ winner_alias: 'tie', status: 'resolved' }).eq('id', ch.id)
          }
        }
      }
      // Reload after resolving
      const fresh = await db.getChallenges(alias)
      setChallenges(fresh)
      // Refrescar bonus_points propio en caso de que algún desafío se haya resuelto ahora
      const myProfile = await db.getUserProfile(alias)
      if (myProfile) setUser(prev => prev ? { ...prev, bonus_points: myProfile.bonus_points || 0 } : prev)
    } catch (e) { console.error('Error cargando desafíos', e) }
  }

  async function loadOfficial() {
    try { const data = await db.getOfficialResults(); setOfficial(data) } catch (e) { console.error('Error cargando resultados oficiales', e) }
  }

  // Busca con IA los resultados de partidos pendientes de hoy y los deja como
  // SUGERENCIA (aiSuggestions). NUNCA escribe directamente en `results` —
  // eso solo lo hace el admin al tocar "Guardar" en el Panel Admin.
  async function runAutoSync() {
    if (isSyncing) return
    if (!official) {
      alert('Todavía se están cargando los datos, esperá unos segundos e intentá de nuevo.')
      return
    }
    setIsSyncing(true)
    try {
      const pending = getPendingTodayMatches(official.results || {})
      if (pending.length === 0) {
        await db.updateSyncStatus({
          syncSource: 'Sin partidos pendientes de hoy',
          syncError: '',
          lastSyncedAt: new Date().toISOString(),
        })
        await loadOfficial()
        setIsSyncing(false)
        return
      }

      const aiData = await fetchResultsFromAI(pending)
      if (aiData && Object.keys(aiData.results).length > 0) {
        setAiSuggestions(prev => ({ ...prev, ...aiData.results }))
        await db.updateSyncStatus({
          syncSource: `Sugerencia IA: ${aiData.source || 'Claude AI'}`,
          syncError: '',
          lastSyncedAt: new Date().toISOString(),
        })
      } else {
        await db.updateSyncStatus({
          syncSource: official?.sync_source || '',
          syncError: 'La IA no encontró resultados nuevos',
          lastSyncedAt: new Date().toISOString(),
        })
      }
      await loadOfficial()
    } catch (err) {
      try {
        await db.updateSyncStatus({
          syncSource: official?.sync_source || '',
          syncError: err.message?.slice(0, 100) || 'Error desconocido',
          lastSyncedAt: new Date().toISOString(),
        })
        await loadOfficial()
      } catch (e) { console.error('Error guardando estado de sync', e) }
    }
    setIsSyncing(false)
  }

  async function handleAdminSave({ results }) {
    await db.saveOfficialResults({
      results,
      syncSource: 'Manual (admin)',
      syncError: '',
      lastSyncedAt: new Date().toISOString(),
    })
    await loadOfficial()
  }

  async function loadLeaderboard() {
    try {
      const rows = await db.getLeaderboard()
      const allChallenges = await supabase.from('challenges').select('*').then(r => r.data || [])

      const scored = rows.map(u => {
        const pts = calcScore(u.predictions, official?.results || {}, u.bonus_points || 0)
        const played = Object.keys(u.predictions || {}).filter(k => k !== 'knockout' && u.predictions[k]?.home !== undefined).length
        // Count accepted or resolved challenges for this user
        const acceptedChallenges = allChallenges.filter(c =>
          (c.from_alias === u.alias || c.to_alias === u.alias) &&
          (c.status === 'accepted' || c.status === 'resolved')
        ).length
        return { alias: u.alias, pts, played, avatar: u.avatar || '⚽', acceptedChallenges }
      }).sort((a, b) => {
        const aQ = a.played >= 20 && a.acceptedChallenges >= 2
        const bQ = b.played >= 20 && b.acceptedChallenges >= 2
        if (aQ && bQ) return b.pts - a.pts
        if (aQ) return -1
        if (bQ) return 1
        return b.played - a.played
      })
      setLeaderboard(scored)
    } catch (e) { console.error('Error cargando leaderboard', e) }
  }

  async function saveAll() {
    setSaving(true)
    try {
      await db.updateUser(user.alias, predictions)
      setUser(prev => ({ ...prev, predictions }))
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
    if (!official) { setAdminError('Cargando datos... esperá unos segundos e intentá de nuevo'); return }
    if (adminPin === ADMIN_PIN) { setShowAdminLogin(false); setShowAdminPanel(true); setAdminPin(''); setAdminError('') }
    else setAdminError('PIN incorrecto')
  }

  const officialResults = official?.results || {}
  const [viewMode, setViewMode] = useState('date') // 'group' | 'date'

  // Sort matches by date for date view
  // Group matches by LOCAL date derived from kickoff
  const matchesByDate = (() => {
    const groups = {}
    MATCHES.forEach(m => {
      const d = m.kickoff ? localDate(m.kickoff) : m.date
      if (!groups[d]) groups[d] = []
      groups[d].push(m)
    })
    // Sort by kickoff time
    return Object.entries(groups)
      .sort((a, b) => new Date(a[1][0].kickoff) - new Date(b[1][0].kickoff))
      .map(([date, matches]) => ({ date, matches }))
  })()

  const groupMatches = MATCHES.filter(m => m.group === activeGroup)
  const myScore = calcScore(predictions, officialResults, user?.bonus_points || 0)
  const completedPreds = Object.keys(predictions).filter(k => k !== 'knockout').length

  if (!user) return <AuthScreen onLogin={setUser} />

  const S = {
    app: { minHeight: '100vh', background: 'linear-gradient(160deg, #0a0e1a 0%, #0d1b2e 100%)', fontFamily: "'Inter', sans-serif", color: '#e2e8f0', paddingBottom: 80 },
    header: { background: '#111827cc', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1e2535', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 8, position: 'sticky', top: 0, zIndex: 100 },
    nav: { position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111827', borderTop: '1px solid #1e2535', display: 'flex', zIndex: 100 },
    navBtn: (a) => ({ flex: 1, padding: '13px 0', border: 'none', cursor: 'pointer', background: 'transparent', color: a ? '#f7c948' : '#4a5568', fontSize: 10, fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, borderTop: a ? '2px solid #f7c948' : '2px solid transparent' }),
    card: { background: '#111827', border: '1px solid #1e2535', borderRadius: 16, padding: 16, marginBottom: 12 },
    input: { width: 50, textAlign: 'center', padding: '10px 0', background: '#0d1117', border: '1px solid #1e2535', borderRadius: 10, color: '#fff', fontSize: 18, fontWeight: 700, outline: 'none' },
    onShare: (match) => setShareMatch(match),
    alias: user.alias,
  }

  return (
    <div style={S.app}>
      {showAdminPanel && <AdminPanel official={official} onSave={handleAdminSave} onForceSync={runAutoSync} isSyncing={isSyncing} aiSuggestions={aiSuggestions} onDismissSuggestion={(id) => setAiSuggestions(prev => { const n = { ...prev }; delete n[id]; return n })} onClose={() => setShowAdminPanel(false)} />}

      {/* Community Modals */}
      {shareMatch && (
        <ShareModal
          match={shareMatch}
          pred={predictions[shareMatch.id] || {}}
          myScore={myScore}
          alias={user.alias}
          official={officialResults[shareMatch.id]}
          onClose={() => setShareMatch(null)}
        />
      )}
      {viewingProfile && (
        <PlayerProfile
          alias={viewingProfile}
          myAlias={user.alias}
          officialResults={officialResults}
          onClose={() => setViewingProfile(null)}
          onChallenge={(alias) => { setViewingProfile(null); setChallengingAlias(alias) }}
        />
      )}
      {showLeagues && (
        <LeaguesPanel
          myAlias={user.alias}
          officialResults={officialResults}
          onClose={() => setShowLeagues(false)}
        />
      )}
      {showAvatarPicker && (
        <AvatarPicker
          current={user.avatar || '⚽'}
          onSelect={async (avatar) => {
            setUser(prev => ({ ...prev, avatar })) // optimista, se ve al instante
            try {
              await db.updateAvatar(user.alias, avatar)
            } catch (e) {
              alert('No se pudo guardar el avatar: ' + e.message)
            }
          }}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}
      {showChallenges && (
        <ChallengesInbox
          challenges={challenges}
          myAlias={user.alias}
          officialResults={officialResults}
          onAccept={async (id, action) => {
            try {
              if (action === 'accept') await db.acceptChallenge(id)
              else if (action === 'cancel') await db.deleteChallenge(id)
              else await supabase.from('challenges').update({ status: 'rejected' }).eq('id', id)
              await loadChallenges(user.alias)
            } catch (e) {
              alert('Error: ' + e.message)
            }
          }}
          onClose={() => setShowChallenges(false)}
        />
      )}
      {challengingAlias && (
        <ChallengeModal
          myAlias={user.alias}
          toAlias={challengingAlias}
          predictions={predictions}
          officialResults={officialResults}
          onClose={() => setChallengingAlias(null)}
          onSend={() => loadChallenges(user.alias)}
        />
      )}

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, overflow: 'hidden' }}>
          <img src={LOGO_SRC} alt="APPro" style={{ height: 28, flexShrink: 0 }} />
          <span style={{ background: '#1e2535', color: '#f7c948', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 6, letterSpacing: 1, flexShrink: 0 }}>BETA</span>
          <button onClick={() => setShowAvatarPicker(true)} title="Cambiar avatar" style={{ background: '#1e2535', border: '1px solid #2a3040', borderRadius: 10, cursor: 'pointer', fontSize: 20, padding: '2px 6px', flexShrink: 0, lineHeight: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            {user.avatar || '⚽'}<span style={{ fontSize: 9, color: '#4a5568' }}>✏️</span>
          </button>
          <span style={{ color: '#4a5568', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.alias}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <ScoreBadge pts={myScore} />
          <button onClick={() => setShowLeagues(true)} style={{ background: 'none', border: '1px solid #2a3040', color: '#4a5568', borderRadius: 8, padding: '5px 7px', cursor: 'pointer', fontSize: 13 }}>🏘️</button>
          <button onClick={() => setShowAdminLogin(true)} style={{ background: 'none', border: '1px solid #2a3040', color: '#4a5568', borderRadius: 8, padding: '5px 7px', cursor: 'pointer', fontSize: 13 }}>⚙</button>
          <button onClick={() => setUser(null)} style={{ background: 'none', border: '1px solid #2a3040', color: '#4a5568', borderRadius: 8, padding: '5px 7px', cursor: 'pointer', fontSize: 13 }}>🚪</button>
        </div>
      </div>

      <SyncBar official={official} isSyncing={isSyncing} />

      {/* Challenges banner */}
      {challenges.filter(c => c.to_alias === user.alias && c.status === 'pending').length > 0 && (
        <div onClick={() => setShowChallenges(true)} style={{
          background: 'linear-gradient(90deg,#6366f122,#8b5cf622)', borderBottom: '1px solid #6366f144',
          padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer',
        }}>
          <span style={{ color: '#a5b4fc', fontSize: 13, fontWeight: 600 }}>
            ⚔️ Tenés {challenges.filter(c => c.to_alias === user.alias && c.status === 'pending').length} desafío{challenges.filter(c => c.to_alias === user.alias && c.status === 'pending').length > 1 ? 's' : ''} pendiente{challenges.filter(c => c.to_alias === user.alias && c.status === 'pending').length > 1 ? 's' : ''}
          </span>
          <span style={{ color: '#6366f1', fontSize: 13, fontWeight: 700 }}>Ver →</span>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '20px 16px', maxWidth: 600, margin: '0 auto' }}>

        {/* MATCHES */}
        {tab === 'matches' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, margin: '0 0 4px' }}>Partidos</h2>
              <p style={{ color: '#4a5568', fontSize: 13, margin: 0 }}>{completedPreds} / {MATCHES.length} grupos pronosticados</p>
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

              {/* Knockout section in group view */}
              <div style={{ marginTop: 24, marginBottom: 16, paddingTop: 20, borderTop: '2px solid #1e2535' }}>
                <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: '0 0 4px' }}>⚡ Fase Eliminatoria</h3>
                <p style={{ color: '#4a5568', fontSize: 12, margin: '0 0 16px' }}>Pronosticá el ganador de cada partido</p>
                <KnockoutSection predictions={predictions} setPredictions={setPredictions} S={S} />
              </div>
            </>)}

            {/* DATE VIEW — grupos + eliminatorias cronológico */}
            {viewMode === 'date' && (<>
              {matchesByDate.map(({ date, matches }) => (
                <div key={date}>
                  <div style={{ color: '#f7c948', fontWeight: 700, fontSize: 13, marginBottom: 10, marginTop: 4, paddingBottom: 6, borderBottom: '1px solid #1e2535' }}>
                    📅 {date}
                  </div>
                  {matches.map(match => <MatchCard key={match.id} match={match} predictions={predictions} officialResults={officialResults} setPred={setPred} S={S} showGroup />)}
                </div>
              ))}

              {/* Eliminatorias a continuación */}
              <div style={{ marginTop: 8 }}>
                <div style={{ color: '#f7c948', fontWeight: 700, fontSize: 13, marginBottom: 10, marginTop: 4, paddingBottom: 6, borderBottom: '1px solid #1e2535' }}>
                  ⚡ Fase Eliminatoria — 28 Jun en adelante
                </div>
                <KnockoutSection predictions={predictions} setPredictions={setPredictions} S={S} />
              </div>
            </>)}
          </div>
        )}
        {/* KNOCKOUT */}

        {/* LEADERBOARD */}
        {tab === 'leaderboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, margin: 0 }}>Posiciones</h2>
              <button onClick={loadLeaderboard} style={{ background: '#1e2535', border: 'none', color: '#8892a0', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13 }}>🔄</button>
            </div>
            <div style={{ background: '#0d1117', borderRadius: 12, padding: '10px 14px', marginBottom: 16, border: '1px solid #1e2535' }}>
              <div style={{ color: '#4a5568', fontSize: 12 }}>🏆 Top <strong style={{ color: '#f7c948' }}>20 mejores partidos</strong> · Mínimo <strong style={{ color: '#f7c948' }}>20 pronosticados</strong> y <strong style={{ color: '#f7c948' }}>2 desafíos aceptados</strong> para clasificar.</div>
            </div>
            {leaderboard.length === 0 && <div style={{ textAlign: 'center', color: '#4a5568', padding: 40 }}>Sin jugadores aún...</div>}
            {leaderboard.map((row, i) => {
              const qualified = row.played >= 20 && row.acceptedChallenges >= 2
              const rankPos = leaderboard.filter((r, j) => j < i && r.played >= 20 && r.acceptedChallenges >= 2).length
              return (
              <div key={row.alias} onClick={() => setViewingProfile(row.alias)} style={{
                ...S.card, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
                borderColor: row.alias === user.alias ? '#f7c94844' : '#1e2535',
                background: row.alias === user.alias ? '#1a1600' : '#111827',
                opacity: qualified ? 1 : 0.7,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: !qualified ? '#1e2535' : rankPos === 0 ? '#f7c948' : rankPos === 1 ? '#b0bec5' : rankPos === 2 ? '#cd7f32' : '#1e2535',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 15,
                  color: !qualified ? '#4a5568' : rankPos < 3 ? '#0a0e1a' : '#4a5568',
                }}>{qualified ? rankPos + 1 : '—'}</div>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{row.avatar || '⚽'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: row.alias === user.alias ? '#f7c948' : '#e2e8f0' }}>
                    {row.alias} {row.alias === user.alias && '← Vos'}
                  </div>
                  <div style={{ fontSize: 11, marginTop: 2 }}>
                    {qualified
                      ? <span style={{ color: '#00e5a0' }}>✓ Clasificado · {row.played} partidos · {row.acceptedChallenges} desafíos</span>
                      : <span style={{ color: '#4a5568' }}>
                          {row.played < 20 ? `⏳ ${row.played}/20 partidos` : '✓ Partidos OK'}
                          {' · '}
                          {row.acceptedChallenges < 2 ? `⚔️ ${row.acceptedChallenges}/2 desafíos` : '✓ Desafíos OK'}
                        </span>
                    }
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ScoreBadge pts={row.pts} />
                  {row.alias !== user.alias && <span style={{ color: '#4a5568', fontSize: 11 }}>👁</span>}
                </div>
              </div>
            )})}
          </div>
        )}
      </div>

      {/* Save button */}
      {tab === 'matches' && (
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
        {[
          { id: 'matches',     icon: '📋', label: 'Partidos'   },
          { id: 'leaderboard', icon: '📊', label: 'Posiciones' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={S.navBtn(tab === t.id)}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>{t.label}
          </button>
        ))}
        <button onClick={() => setShowChallenges(true)} style={{ ...S.navBtn(false), position: 'relative' }}>
          <span style={{ fontSize: 18 }}>⚔️</span>
          Desafíos
          {challenges.filter(c => c.to_alias === user.alias && c.status === 'pending').length > 0 && (
            <span style={{ position: 'absolute', top: 8, right: '50%', transform: 'translateX(8px)', background: '#ff6b35', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {challenges.filter(c => c.to_alias === user.alias && c.status === 'pending').length}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
