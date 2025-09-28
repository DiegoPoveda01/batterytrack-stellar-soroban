<div align="center">

# BatteryTrack ♻️⚡ — Trazabilidad verde con Stellar + Soroban

Tokeniza pilas y lotes como activos NFT/semi-fungibles y registra eventos de su ciclo de vida (fabricación → distribución → venta → recolección → reciclaje). Gamifica la devolución con incentivos verdes (GREEN/USDC) y audita todo en un backend listo para Soroban.

Demo full-stack: React + Tailwind + Express + Stellar/Soroban.

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
- Revisa dashboard + historial, filtra/busca por estado/fabricante/ID.
- Copia el token rápidamente desde la tarjeta o el detalle (tooltip de confirmación).
- Cambia entre tema claro/oscuro; elimina registros si lo necesitas.

## Arquitectura

- Frontend (client/): React + Vite + TailwindCSS
  - Páginas: Dashboard, Registrar, Detalle, Wallet
  - Cliente REST minimal para consumir API
  - UI moderna: timeline por etapa con colores y tooltips, breadcrumb, toasts, modal de confirmación, botón “copiar token”, búsqueda y filtros
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
- `DELETE /api/batteries/:id` → `{ ok, data: { id, deleted: true, event } }`
- `POST /api/wallet/simulate-return` → `{ ok, data: { balance, event } }`
- `GET /api/wallet/balance/:pub` → `{ ok, data: balance }`
- `GET /health` → `{ ok: true, ts }`

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

### Modo “preview” (producción local)
Para previsualizar la build del frontend con el backend:

```powershell
# Construir el frontend y lanzar servidor + preview
npm --prefix client run build; npm run start
```

Por defecto, el backend corre en `:4000` y el preview en el puerto que asigne Vite.

### Modo on-chain (opcional, testnet real)
- Copia `server/.env.example` a `server/.env` y configura:
```
ENABLE_ONCHAIN=true
STELLAR_NETWORK=testnet
ISSUER_SECRET=SA... # Cuenta fondeada en testnet
SOROBAN_RPC=https://rpc-futurenet.stellar.org
```
- Reinicia el backend. Nota: Este demo usa una emisión “NFT-like” simple; para Soroban real, compila y despliega el contrato, y ajusta llamadas RPC.

Variables útiles:
- `PORT` (server): cambia el puerto del backend (default 4000).
- `VITE_API_PORT` (client): cambia el puerto de destino del proxy `/api` y `/health` en desarrollo.

### Solución de problemas (Windows)
- “No puedo acceder a /health” o el puerto 4000 está ocupado:

```powershell
# Ver y matar procesos usando el puerto 4000
$p=(Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue).OwningProcess; if($p){ Stop-Process -Id $p -Force }
```

- Cambiar puertos si hubiera conflicto: define `PORT=4010` para el backend y `VITE_API_PORT=4010` para el frontend (en variables de entorno) y vuelve a ejecutar `npm run dev`.

---

## Roadmap rápido
- Integración real con Soroban: contrato, eventos on-chain, y parsing de XDRs
- Persistencia real (Postgres/Mongo) y filtros/paginación
- Integración con wallet (Freighter) en el frontend
- Roles y permisos por etapa del ciclo de vida

## Licencia
MIT — Uso educativo y demostraciones.
