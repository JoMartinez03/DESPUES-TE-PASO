# DespuésTePaso

Web app mobile-first (AR) para llevar la cuenta entre amigos: deudas, pagos y
juntadas, sin romper amistades.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack, TypeScript)
- **Tailwind CSS v4** + **shadcn/ui** (Base UI, preset `nova`)
- **Prisma 7** sobre **PostgreSQL** (adaptador `@prisma/adapter-pg`)
- **Auth.js v5** (Credentials + JWT, `bcryptjs`)
- **Zod 4** para validaciones

## Requisitos

- Node.js ≥ 20 (probado con v25)
- Docker Desktop (para la base local)

## Puesta en marcha

```bash
npm install
npm run db:migrate        # aplica migraciones contra tu base
npm run dev               # http://localhost:3000
```

### Base de datos

**Opción A — Docker (desarrollo):**

```bash
docker compose up -d
```

Levanta `postgres:17-alpine` en `localhost:54322`
(`despues` / `despues` / `despues`). Copiá `.env.example` a `.env`, que ya
apunta a esta base local.

**Opción B — Neon (producción/preview):**

1. Creá un proyecto en [Neon](https://neon.tech) y copiá las dos cadenas de
   conexión: la **pooled** (con `-pooler`) y la **directa**.
2. En `.env`:

   ```env
   DATABASE_URL="postgresql://…-pooler.neon.tech/db?sslmode=require"
   DATABASE_URL_UNPOOLED="postgresql://…neon.tech/db?sslmode=require"
   ```
3. Aplicá el esquema: `npm run db:deploy`

> El cliente de Prisma usa `DATABASE_URL_UNPOOLED` (conexión directa) porque el
> adaptador `pg` es TCP; la pooler de Neon solo acepta conexiones TCP, no
> WebSocket. Por eso no usamos `@prisma/adapter-neon` (WebSocket): no conecta
> contra el Postgres local de Docker.

### Variables de entorno

Ver `.env.example`. `AUTH_SECRET` se genera con `openssl rand -base64 32`.

## Scripts

| Script               | Qué hace                                  |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Servidor de desarrollo                    |
| `npm run build`      | Build de producción                        |
| `npm run start`      | Sirve el build                             |
| `npm run lint`       | ESLint                                    |
| `npm run typecheck`  | `tsc --noEmit`                             |
| `npm run db:migrate` | `prisma migrate dev` (desarrollo)          |
| `npm run db:deploy`  | `prisma migrate deploy` (producción)       |
| `npm run db:generate`| Regenera el cliente Prisma                 |
| `npm run db:studio`  | Prisma Studio                              |

## Estructura

```
src/
  app/
    (app)/            # áreas con sesión: dashboard, personas, juntadas, perfil
    (public)/         # login y registro
    api/auth/         # handlers de Auth.js
  actions/            # server actions (auth)
  components/
    auth/             # formularios de login/registro, add-friend
    layout/           # app-shell, sidebar, header, bottom-nav, FAB, campana
    shared/           # empty-state, stat-card, user-avatar, page-header
    ui/               # componentes shadcn/ui
  lib/                # prisma, auth, session, format, validaciones
  queries/            # consultas de datos (dashboard)
  generated/prisma/   # cliente generado (no editar)
proxy.ts              # protección de rutas (Next 16 renombró middleware a proxy)
prisma/schema.prisma  # modelo de datos
```

## Notas del esquema

- Un `Transaction` registra cada movimiento una sola vez
  (`debtorId` + `creditorId`, una perspectiva), sin duplicar registros por
  usuario.
- Los movimientos `PENDING` **no** afectan los saldos; recién cuando se
  confirman (`CONFIRMED`). Los **saldos no se almacenan**: se derivan de las
  transacciones confirmadas.
- Los gastos de juntadas viven en `Expense` / `ExpenseParticipant` (no
  generan transacciones automáticamente por ahora).

## Seguridad

- Passwords con `bcryptjs` (cost 12), sessions JWT de 30 días, cookies
  `httpOnly`.
- `AUTH_SECRET` y credenciales nunca van al repo; se documentan en
  `.env.example` únicamente.
- `npm audit` reporta 4 vulnerabilidades *high* en dependencias dev-only
  transitivas del CLI de Prisma (`deepmerge-ts`, `mysql2`); no aplican al
  stack (Postgres). No correr `npm audit fix --force` porque degradaría Prisma
  a v6.

## Checklist manual (Issue 1)

1. `/` redirige a `/login` sin sesión.
2. Registro → login automático → dashboard.
3. `/dashboard`, `/personas`, `/juntadas`, `/perfil` redirigen a `/login`
   sin sesión.
4. Login inválido muestra error; login válido muestra el dashboard con los
   tres resúmenes en `$0`.
5. `/personas` vacío muestra empty-state y CTA "Agregar amigo".
6. FAB móvil abre la hoja con acciones (deuda/pago "Próximamente",
   "Nueva juntada" navega).
7. Campana de notificaciones muestra "Todavía no recibís notificaciones".
8. `/perfil` muestra datos y "Cerrar sesión" vuelve a `/login`.
9. Rutas inexistentes o amigos/juntadas ajenos → 404 en español.