# APProde ⚽ — Prode del Mundial 2026

App de pronósticos para el Mundial 2026 con auto-sincronización de resultados via IA.

---

## Stack
- **React + Vite** — frontend
- **Supabase** — base de datos (PostgreSQL)
- **Vercel** — hosting
- **Claude AI** — scraping automático de resultados

---

## Setup paso a paso

### 1. Clonar y preparar el proyecto

```bash
git clone https://github.com/TU_USUARIO/approde.git
cd approde
npm install
```

### 2. Crear el archivo .env

```bash
cp .env.example .env
```

Completar `.env` con tus valores reales:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_ADMIN_PIN=9999
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

**Dónde conseguir cada valor:**
- `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` → supabase.com → tu proyecto → Settings → API
- `VITE_ADMIN_PIN` → el PIN que quieras para el panel de admin (4 dígitos)
- `VITE_ANTHROPIC_API_KEY` → console.anthropic.com → API Keys

### 3. Crear las tablas en Supabase

1. Ir a supabase.com → tu proyecto → **SQL Editor**
2. Pegar el contenido de `supabase-schema.sql`
3. Ejecutar con **Run**

### 4. Correr en local

```bash
npm run dev
```

Abrir http://localhost:5173

### 5. Deploy en Vercel

**Opción A — desde la web:**
1. Subir el código a GitHub
2. Ir a vercel.com → New Project → importar el repo
3. En "Environment Variables" cargar las mismas variables del `.env`
4. Deploy ✓

**Opción B — desde CLI:**
```bash
npm i -g vercel
vercel
# Seguir los pasos y cargar las env vars cuando lo pide
```

---

## Uso

### Para los clientes (jugadores)
1. Entrar a la URL del deploy
2. Registrarse con alias + PIN de 4 dígitos
3. Pronosticar los partidos de la fase de grupos
4. Elegir campeón y goleador
5. Ver la tabla de posiciones en tiempo real

### Para el administrador
1. Click en ⚙ (header) → ingresar PIN de admin
2. Desde el panel admin:
   - Ver estado de la última sincronización automática
   - Forzar una sincronización inmediata (busca resultados en la web)
   - Editar resultados manualmente por grupo
   - Definir campeón y goleador oficial

---

## Sistema de puntos

| Pronóstico | Puntos |
|---|---|
| Resultado correcto (G/E/P) | +1 |
| Marcador exacto | +3 |
| Campeón del mundial | +5 |
| Goleador del mundial | +3 |

---

## Estructura del proyecto

```
approde/
├── src/
│   ├── main.jsx          # Entry point React
│   ├── App.jsx           # App completa
│   └── supabase.js       # Cliente Supabase
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
├── package.json
├── .env.example
├── .gitignore
└── supabase-schema.sql
```
