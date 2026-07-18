# ROADMAP · Backend de producción — NEXUS INMO

> **Estado actual:** demo funcional 100 % en el frontend. Todos los datos viven en
> un store de Svelte (runes) sembrado con datos ficticios y persistido en
> `sessionStorage`. **No hay backend.**
>
> **Este documento** describe cómo llevar NEXUS INMO a producción **cuando haya un
> cliente firmado**. Es una guía de arquitectura: **no se construye nada todavía**.
>
> Principio rector: **la app está diseñada para que solo cambie la capa de datos.**
> Los componentes nunca tocan el store directamente — solo `src/lib/data/repository.ts`
> (el objeto `repo`). Migrar a Supabase = reescribir ese módulo. La UI no se toca.

---

## 1. Migración de la capa de datos a Supabase

### 1.1 Qué se sustituye
Hoy `repository.ts` lee/escribe el store en memoria. En producción, cada función
del `repo` pasa a hablar con **Supabase** (Postgres + Auth + Storage + Realtime):

| Función actual (`repo`)        | Producción (Supabase)                                    |
| ------------------------------ | -------------------------------------------------------- |
| `getProperties()` / `searchProperties()` | `select` sobre `properties` (filtros como `where`) |
| `getLeads()` / `getLeadsByStatus()`      | `select` sobre `leads` con RLS por agencia         |
| `addLead()`                    | `insert` en `leads`                                      |
| `updateLead()` / `setLeadStatus()` | `update` en `leads`                                  |
| `addVisit()` / `setVisitStatus()`  | `insert` / `update` en `visits`                      |
| `closeOperation()`             | `insert` en `operations` + `update` de `properties.status` |
| `setPropertyStatus()`          | `update` en `properties`                                 |
| lectura reactiva (stores)      | **Supabase Realtime** (subscripciones) → mantiene la reactividad actual |

Las firmas se mantienen; internamente se vuelven `async`. La UI ya consume `repo`,
así que el cambio es transparente salvo `await` en las cargas iniciales.

### 1.2 Esquema (mapea 1:1 con `src/lib/data/types.ts`)
Bosquejo de referencia (no ejecutar aún):

```sql
-- Cada fila pertenece a una agencia (multi-tenant, ver §3)
create table agencies   ( id uuid primary key, name text, created_at timestamptz default now() );
create table agents     ( id uuid primary key, agency_id uuid references agencies,
                          name text, role text, email text unique, phone text, avatar text, zones text[] );
create table properties ( id uuid primary key, agency_id uuid references agencies,
                          ref text, agent_id uuid references agents, title text, description text,
                          type text, operation text, status text, price int,
                          city text, zone text, country text, lat float8, lng float8,
                          bedrooms int, bathrooms int, area int, parking bool, terrace bool,
                          pool bool, elevator bool, energy_rating text, year_built int,
                          amenities text[], images text[], featured bool, created_at timestamptz );
create table leads      ( id uuid primary key, agency_id uuid references agencies,
                          name text, phone text, email text, type text, status text, source text,
                          temperature text, agent_id uuid, property_id uuid, budget int, zone text,
                          needs_mortgage bool, urgency text, notes text,
                          created_at timestamptz, last_activity_at timestamptz );
create table visits     ( id uuid primary key, agency_id uuid references agencies,
                          property_id uuid, lead_id uuid, agent_id uuid,
                          date date, time text, status text, notes text );
create table operations ( id uuid primary key, agency_id uuid references agencies,
                          ref text, property_id uuid, property_title text, type text, operation text,
                          city text, zone text, country text, agent_id uuid, client_name text,
                          final_price int, commission int, lead_created_at date, closed_at date );
```

### 1.3 Autenticación real multi-usuario
- **Supabase Auth** (email + contraseña o magic link). Sustituye el login demo
  (`src/lib/auth/session.svelte.ts`, hoy `demo`/`demo2026`).
- Roles: **dueño** (acceso total de la agencia) y **agentes** (emails registrados;
  ven sus leads/visitas, según política).
- **Row Level Security (RLS):** cada consulta filtra por `agency_id` del usuario
  autenticado. Es la primera línea del aislamiento entre clientes (ver §3).
- La ruta `/panel` deja de ser "oculta con login demo" y pasa a exigir sesión real.

### 1.4 Exportación mensual de respaldo
- Cron mensual (n8n, §2) que exporta cada tabla de la agencia a CSV/JSON y lo
  guarda en Supabase Storage y/o lo envía por email al dueño. Copia de seguridad
  y portabilidad de datos del cliente.

---

## 2. Automatizaciones: **n8n self-hosted** (no cron jobs en el código)

**Decisión de arquitectura:** todas las automatizaciones se implementan como
**flujos de n8n self-hosted en un VPS propio**, no como cron jobs dentro del código
de la app. Ventajas: se editan sin desplegar, se ven ejecutar visualmente, se
reutilizan entre clientes y separan la lógica de negocio del frontend estático.

### 2.1 Seguimiento de fríos
`Cron diario` → consulta en Supabase los leads inactivos **+3 días**
(`last_activity_at < now() - 3d`, excluyendo cerrados/perdidos) → envía **WhatsApp**
de reactivación → marca el lead como reactivado (`update last_activity_at`).
*(En la demo esto es el botón “Reactivar” de la pestaña de fríos.)*

### 2.2 Ingesta de leads desde portales (entrada)
`Email entrante` de Idealista / Fotocasa / Milanuncios / Immoweb (los portales
envían el contacto por email a la agencia) → **n8n lee el email** → **extrae los
datos** (un **nodo de IA** cuando el formato varía entre portales) → **crea el lead
en Supabase** → dispara el **primer WhatsApp** de respuesta automática al interesado.
No requiere homologación (ver §4, Fase 1). **Es la prioridad.**

### 2.3 Informe trimestral
`Cron trimestral` → consulta las operaciones cerradas del trimestre → **genera el
PDF** (mismo tipo de informe que la pestaña “Informes” de la demo) → lo **envía por
email al dueño** con **Resend**.

### 2.4 Alerta de lead caliente
`Trigger` de lead nuevo con **señales fuertes** (p. ej. presupuesto alto + urgencia
alta + financiación aprobada) → **WhatsApp directo al móvil del dueño** para que
actúe en caliente.

### 2.5 Publicación "VENDIDO"
`Trigger` de operación marcada como cerrada → **post automático** en las redes de la
agencia (Instagram/Facebook) celebrando la venta/alquiler.

---

## 3. Modelo multi-cliente (aislamiento de datos)

- **Cada cliente tiene su propio proyecto Supabase** (base de datos aislada) y su
  **propio número de WhatsApp Business API**. El aislamiento es a nivel de
  **proyecto/base de datos**, no solo por fila: los datos de dos agencias viven en
  bases distintas y **nunca se mezclan**, ni por error de una consulta ni por un fallo
  de RLS. Es el máximo nivel de separación y el argumento de confianza para el cliente.
- **Flujos de n8n duplicados por cliente**, cambiando únicamente las credenciales
  (proyecto Supabase + número de WhatsApp + cuentas de portales). Es la **fase
  inicial**, válida y sencilla hasta **~10 clientes**.
- **Migración futura** a un **flujo único multi-cliente** que lee una **tabla de
  configuración** (credenciales/parámetros por agencia) y enruta cada ejecución al
  cliente correcto. Se hace **cuando el volumen lo justifique** (mantener 10+ copias
  de cada flujo deja de ser práctico).
- Dentro de cada proyecto, **RLS por `agency_id`** protege también el caso de varias
  agencias en un mismo proyecto si en algún momento se consolida.

---

## 4. Integración con portales (dos direcciones, distinta dificultad)

### Fase 1 — ENTRADA de leads (sin trámites, **PRIORIDAD**)
Capturar los leads que los portales **envían por email** a la agencia, vía n8n
(ver §2.2). **No requiere homologación ni contrato especial** más allá de tener
publicados los anuncios. Es lo primero que se activa con cada cliente porque da
valor inmediato sin fricción.

### Fase 2 — SALIDA / multipublicación (requiere trámite)
Publicar las propiedades de la agencia **en los portales** mediante **feeds XML/API**.
Requisitos:
- La agencia debe tener **contrato de pago** con cada portal.
- El software debe estar **dado de alta como proveedor/CRM homologado** por cada
  portal (proceso de validación del feed).

Se aborda **cuando haya 2-3 clientes activos** que lo justifiquen.

#### Especificaciones de feed (referencia)
Los portales **leen (pull) un feed XML** publicado en una URL, con una **frecuencia**
acordada (típicamente cada pocas horas). Estructura típica por inmueble:

```xml
<!-- Referencia orientativa — confirmar campos EXACTOS con la spec oficial de cada portal -->
<property>
  <reference>NX-2041</reference>
  <type>flat</type>                 <!-- piso/ático/casa/chalet... -->
  <operation>sale</operation>       <!-- sale | rent -->
  <price>685000</price>
  <currency>EUR</currency>
  <address><town>Madrid</town><zone>Chamberí</zone><country>ES</country></address>
  <surface unit="m2">128</surface>
  <rooms>3</rooms>
  <bathrooms>2</bathrooms>
  <energy_certificate>B</energy_certificate>
  <features><parking>1</parking><terrace>1</terrace><lift>1</lift></features>
  <description lang="es">…</description>
  <images><image order="1">https://…</image>…</images>
</property>
```

- **Idealista:** feed XML por CRM homologado; alta como proveedor + credenciales de
  la agencia. Confirmar el **XSD oficial** (nombres de campos, enums de tipo/operación,
  límites de imágenes) antes de implementar.
- **Fotocasa (Adevinta):** feed XML equivalente con su propio esquema y proceso de
  homologación. Mismo enfoque; los nombres de campo difieren.
- **Milanuncios / Immoweb (BE):** cada uno con su formato; Immoweb es clave para el
  mercado belga.

> ⚠️ Las etiquetas de arriba son **orientativas**. Cada portal publica su
> especificación oficial (XSD/documentación) y **es obligatorio ajustarse a ella**
> campo por campo para pasar la validación de homologación.

---

## 5. Plan por fases (cuando haya cliente firmado)

| Fase | Entregable | Depende de |
| ---- | ---------- | ---------- |
| **0** | Proyecto Supabase del cliente + esquema (§1.2) + migración de `repository.ts` + Auth real (§1.3) | cliente firmado |
| **1** | n8n: **ingesta de leads por email** (§2.2) + alerta de lead caliente (§2.4) + seguimiento de fríos (§2.1) | Fase 0 |
| **2** | n8n: informe trimestral por Resend (§2.3) + export mensual (§1.4) + post "VENDIDO" (§2.5) | Fase 0-1 |
| **3** | **Salida a portales** (feeds XML Idealista/Fotocasa/Immoweb) (§4 Fase 2) | 2-3 clientes activos + contratos/homologación |
| **4** | Consolidación: flujo n8n **único multi-cliente** con tabla de config (§3) | ~10+ clientes |

---

## 6. Servicios y costes recurrentes (a validar por cliente)
- **Supabase** (proyecto por cliente): plan según volumen.
- **WhatsApp Business API** (número por cliente): proveedor (Meta / BSP).
- **n8n self-hosted**: VPS propio (compartido entre clientes).
- **Resend**: envío de emails transaccionales (informes, respaldos).
- **Portales** (Fase 2): contrato de pago de la agencia con cada portal.

---

*Documento vivo. Actualizar al firmar el primer cliente y al confirmar las specs
oficiales de cada portal.*
