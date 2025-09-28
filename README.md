<div align="center">

# BatteryTrack ♻️⚡ — Trazabilidad verde con Stellar + Soroban

Tokeniza pilas y lotes como activos NFT/semi-fungibles y registra eventos de su ciclo de vida (fabricación → distribución → venta → recolección → reciclaje). Gamifica la devolución con incentivos verdes (GREEN/USDC) y audita todo en un backend listo para Soroban.

Demo full-stack para Hackatón: React + Tailwind + Express + Stellar/Soroban.

</div>

---

## ¿Qué resuelve BatteryTrack?

- Transparencia ambiental: Cada pila/lote tiene un “token” con historial auditable.
- Economía circular: Incentivos por devolución y reciclaje.
- Interoperabilidad: Preparado para Soroban (contratos inteligentes de Stellar) y compatible con activos tipo NFT-like.

## Experiencia de usuario en 60 s

- Crea/Registra un lote de pilas → se emite un token (simulado por defecto).
- Visualiza y avanza su estado a lo largo del ciclo de vida.
- Devuelve pilas y recibe incentivos GREEN/USDC (simulados).
- Revisa dashboard + historial.

## Arquitectura

- Frontend (client/): React + Vite + TailwindCSS
  - Páginas: Dashboard, Registrar, Detalle, Wallet
  - Cliente REST minimal para consumir API
  - Proxy a `/api` → backend local
- Backend (server/): Node.js + Express
  - Rutas: baterías, estados, eventos, wallet simulada
  - Servicio Stellar/Soroban (simulado por defecto; on-chain opcional)
  - Formato de respuesta unificado: `{ ok, data, meta? } | { ok: false, error }`
  - Almacenamiento en memoria (listo para reemplazar por DB)

## Tecnologías clave

- React 18 + React Router 6 + TailwindCSS 3 + Vite 5
- Express 4 + morgan + cors + dotenv
- SDK Stellar `@stellar/stellar-sdk` (simulado por defecto)
- Scripts orquestados con `concurrently`

## Estructura del repo

- `client/` — UI (React + Tailwind)
- `server/` — API (Express) y servicios Stellar/Soroban
- `server/utils/format.js` — DTOs: formato consistente de respuestas
- `server/services/stellar.js` — Integración (simulada) con Stellar/Soroban
- `server/routes/*` — Rutas de baterías y wallet
- `server/store/memory.js` — Store en memoria
- `package.json` (raíz) — scripts para ejecutar todo en paralelo

## Endpoints principales (formato)

- `GET /api/batteries` → `{ ok, data: BatteryDTO[], meta: { count } }`
- `POST /api/batteries` → `{ ok, data: { battery: BatteryDTO, event } }`
- `GET /api/batteries/:id` → `{ ok, data: BatteryDTO }`
- `POST /api/batteries/:id/estado` → `{ ok, data: { battery: BatteryDTO, event } }`
- `GET /api/batteries/events/all` → `{ ok, data: EventDTO[], meta: { count } }`
- `POST /api/wallet/simulate-return` → `{ ok, data: { balance, event } }`
- `GET /api/wallet/balance/:pub` → `{ ok, data: balance }`

BatteryDTO (resumen):
- `id`
- `specs`: `{ tipo, fabricante }`
- `registeredAt`: ISO
- `lifecycle`: `{ state, history[{ at, state }], states[] }`
- `token`: `{ assetCode, issuer, txId, onchain }`
- `links`: `{ self, updateState }`

---

## Tutorial — de 0 a demo en minutos (Windows PowerShell)

Requisitos:
- Node.js 18+ instalado

1) Instalar dependencias (cliente y servidor):
```powershell
npm --prefix client install; npm --prefix server install; npm install
```

2) Ejecutar todo en paralelo (frontend + backend):
```powershell
npm run dev
```
- Frontend: mostrará la URL (p. ej. http://localhost:5173)
- Backend: http://localhost:4000

3) Probar el flujo:
- Abre el frontend
- Ir a “Registrar” → completa y guarda
- En Dashboard → entra al detalle → avanza estado
- Wallet → simula devolución (+1 GREEN)

4) Salud del backend (opcional):
```powershell
# Estado del servidor
Invoke-WebRequest -UseBasicParsing http://localhost:4000/health | Select-Object -ExpandProperty Content
```

### Modo on-chain (opcional, testnet real)
- Copia `server/.env.example` a `server/.env` y configura:
```
ENABLE_ONCHAIN=true
STELLAR_NETWORK=testnet
ISSUER_SECRET=SA... # Cuenta fondeada en testnet
SOROBAN_RPC=https://rpc-futurenet.stellar.org
```
- Reinicia el backend. Nota: Este demo usa una emisión “NFT-like” simple; para Soroban real, compila y despliega el contrato, y ajusta llamadas RPC.

---

## Subir a GitHub (guía)

1) Inicializa git y crea el repo remoto en GitHub (vacío):
```powershell
git init
git add .
git commit -m "feat: BatteryTrack demo Stellar/Soroban (frontend+backend)"
```
2) Conecta el remoto y push (reemplaza TU_USUARIO y NOMBRE_REPO):
```powershell
git branch -M main
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO.git
git push -u origin main
```

> Consejo hackatón: añade screenshots/GIFs del flujo (Dashboard, Registro, Detalle, Wallet) y enlázalos aquí para impresionar al jurado.

---

## Roadmap rápido (post-hackatón)
- Integración real con Soroban: contrato, eventos on-chain, y parsing de XDRs
- Persistencia real (Postgres/Mongo) y filtros/paginación
- Integración con wallet (Freighter) en el frontend
- Roles y permisos por etapa del ciclo de vida

## Licencia
MIT — Uso educativo y demostraciones.
