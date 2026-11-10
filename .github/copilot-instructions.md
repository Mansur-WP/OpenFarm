# AgriTech Africa - Copilot Instructions

## Project identity

This repository is being transformed from OpenFarm into **AgriTech Africa**.

- **Target users:** African crop farmers, starting with Nigeria
- **Product direction:** A simple, farmer-facing agricultural platform powered by advanced agricultural intelligence
- **Primary product goal:** Turn satellite, weather, soil and field data into practical, understandable and trustworthy farming guidance
- **Current product baseline:** Existing OpenFarm functionality must remain available unless a change is explicitly approved

AgriTech Africa is not only a technical monitoring system. Features should be designed for farmers with limited digital experience, limited connectivity and limited time.

## Existing architecture

Preserve the current service boundaries unless a documented architectural reason justifies a change.

- **Frontend:** `apps/web/`, Next.js 14, React, TypeScript, Tailwind, shadcn/ui, NextAuth, next-intl, MapLibre GL and ECharts
- **Backend API:** `services/api/`, FastAPI, Python, SQLAlchemy 2.0, Pydantic and Alembic
- **Database:** PostgreSQL with PostGIS for transactional, spatial and geospatial data
- **Background processing:** Redis and Celery workers in `services/api/app/tasks/`
- **Object storage:** MinIO for raster COGs, model files, basemaps and scouting photos
- **Raster visualization:** MapLibre in the web client and TiTiler in `services/tiler/`
- **Deployment:** Docker Compose, Caddy and optional Terraform deployment

The current data and processing layers are:

- **Observation:** Sentinel-2 imagery, Open-Meteo weather, SoilGrids or POLARIS soil data, field geometries and scouting observations
- **Intelligence:** Vegetation indices, alerts, soil-derived risk scores, crop suitability and weather-soil stress
- **Delivery:** Maps, charts, dashboards, reports, API responses, scouting tools and share links

### Critical data-flow rules

1. Next.js communicates with the FastAPI API for application data.
2. The Next.js server connects directly to PostgreSQL only for the existing NextAuth user-upsert flow in `apps/web/src/lib/db.ts`.
3. API requests use the versioned `/v1` routes and include JWT authentication plus `X-Org-Id` for organization-scoped resources.
4. Long-running work must use Celery and Redis rather than blocking API requests.
5. Raster processing follows the existing pattern: STAC search, band reads, index computation, COG creation, MinIO storage, zonal statistics and TiTiler rendering.
6. Celery tasks use the synchronous database session. FastAPI request handlers use the asynchronous database session.

## Engineering standards

### Preserve compatibility

- Preserve the existing architecture and conventions unless a documented reason justifies a change.
- Do not remove existing features, endpoints, data or workflows without explicit approval.
- Maintain API compatibility. Prefer additive, backward-compatible changes.
- If a breaking change is unavoidable, document the affected contracts, migration path, rollout order and rollback plan before implementation.
- Keep existing organization, farm, field, monitoring, weather, soil, scouting, alert and sharing behavior working while new capabilities are introduced.

### Database and migrations

- Use Alembic migrations for every database schema change.
- Do not edit an existing migration that may already have been applied. Add a new migration instead.
- Keep ORM models, Pydantic schemas, migrations and API responses consistent.
- Preserve UUID identifiers, PostGIS geometry conventions and existing soft-delete behavior.
- Keep `org_id` on organization-scoped data and enforce tenant filters in every relevant query.
- Consider indexes, foreign keys, migration safety, data backfill and rollback implications before changing the schema.

### API and background jobs

- Keep API routes under `/v1`.
- Use existing authentication and RBAC dependencies rather than creating parallel authorization logic.
- Preserve the existing pagination envelope: `{ items, total, limit, offset }`.
- Return explicit errors using repository conventions. Do not silently convert failures into successful-looking responses.
- Make background tasks idempotent where possible.
- Record meaningful job progress and failure details for long-running work.
- Validate external responses before storing them.
- Preserve provenance, source, date, quality and confidence metadata for derived agricultural data.

### Testing and validation

- Add focused tests for new functionality and bug fixes.
- Cover authorization, tenant isolation, invalid input, missing data and provider failures where applicable.
- Run the smallest relevant lint, type-check, test, migration or build commands before considering work complete.
- Validate measurable requirements directly, not through a proxy.
- Do not claim a feature is implemented unless it exists in the source code and has been tested or otherwise verified.
- Report incomplete, blocked or unverified work plainly.

## Product principles

- **Mobile-first:** Design workflows for phones before desktop enhancement.
- **Simple language:** Use clear, short wording. Avoid unexplained technical or agronomic jargon.
- **Farmer accessibility:** Assume users may have limited digital experience, small screens and intermittent connectivity.
- **Low bandwidth:** Minimize payloads, unnecessary map tiles, large images and repeated requests. Support useful summaries when full visualizations are unavailable.
- **Localization:** Support English and Hausa as first-class locales. Do not hard-code user-facing text. Use the existing `next-intl` message and routing patterns.
- **Practical recommendations:** Prefer clear next actions, timing, reasons and limitations over raw data displays.
- **Trust:** Make it clear what is observed, what is estimated and what is recommended.
- **Progressive complexity:** Give farmers simple conclusions first, with detailed evidence available for agronomists and advanced users.

When adding a user-facing feature, consider:

1. Can a farmer understand the result without technical training?
2. Can the workflow complete on a low-end phone?
3. What happens when connectivity or external data is unavailable?
4. Is the recommended action practical for the farmer's location and resources?
5. Can the user see why the recommendation was made?

## Agricultural principles

### Evidence and uncertainty

- Do not present satellite estimates, interpolated weather, model outputs or soil maps as ground truth.
- Distinguish field observations, laboratory measurements, remote-sensing estimates and model-derived values.
- Include data source, observation or model date, spatial resolution and confidence or quality information where applicable.
- Preserve uncertainty rather than replacing it with false precision.
- Use clear disclaimers for regional estimates, especially SoilGrids-derived values.

### Nigerian and African agronomy

- Do not invent Nigerian agricultural recommendations, crop calendars, local-language terminology or agronomic thresholds.
- Do not generalize recommendations from United States, European or global datasets without documenting the limitation.
- Important recommendations must receive appropriate validation from qualified agronomists, agricultural extension specialists or reliable local evidence before being presented as guidance.
- Treat crop suitability as decision support, not a guaranteed yield, profitability or prescription.
- Consider local agroecological zones, crop varieties, planting windows, rainfall patterns, irrigation access, soil fertility, pests, disease, labor, input access and farmer objectives.
- Keep assumptions and limiting factors visible to users.

### Earth observation integrations

- The existing satellite analytics pipeline uses ESA/Copernicus Sentinel-2 data accessed through the Element84 Earth Search STAC API.
- Do not describe the existing Sentinel-2 integration as a NASA integration.
- NASA integrations, such as NASA POWER, SMAP or MODIS, must remain separate from Sentinel-2 integrations until they are explicitly implemented, tested, attributed and verified.
- Do not add NASA data sources by assumption. Document the provider, licensing, variables, resolution, refresh behavior, failure modes and validation plan first.
- Keep satellite source, scene date, cloud or quality metadata and processing provenance attached to derived outputs.

## Security principles

- Never use default, placeholder or known production secrets.
- Production services must fail safely when required secrets are missing or invalid.
- Enforce tenant isolation on every organization-scoped read, write, job and storage operation.
- Use the existing JWT and organization-membership dependencies unless a replacement is documented and reviewed.
- Enforce role-based permissions consistently. A UI restriction is not a security control.
- Validate uploaded files by declared type, actual content, size, extension and storage destination. Consider malware scanning, image decoding and metadata removal for farmer photos.
- Protect farmer information, field locations, photos, contact details and operational data from unintended public exposure.
- Review share-link scope, expiration, revocation and returned fields before changing public report behavior.
- Do not expose secrets, tokens, database errors, provider credentials or sensitive identifiers in logs or error responses.
- Treat JWTs in URLs, public object paths and presigned URLs as sensitive.
- Use rate limits and abuse protection for authentication, invitations, uploads, public links and expensive processing jobs.
- Do not weaken existing authorization or storage policies to simplify development.

## Copilot working rules

1. Inspect relevant existing code, schemas, routes, migrations, tests and documentation before changing anything.
2. Search for existing helpers, patterns and call sites before adding new logic.
3. Avoid unnecessary rewrites, broad refactors and duplicate implementations.
4. Do not remove existing functionality without explicit approval.
5. Break large tasks into small, reviewable and independently verifiable changes.
6. Explain database, API, security and architectural implications before major changes.
7. Keep changes surgical and limited to the approved scope.
8. Update directly related documentation when behavior, configuration or operational procedures change.
9. Preserve existing naming, formatting, localization, logging and error-handling conventions.
10. Prefer explicit validation and typed guards over broad exception handling, unsafe casts or silent fallbacks.
11. Do not install or upgrade dependencies unless the task explicitly requires it or a documented validation failure proves it is necessary.
12. Do not modify application source code, schemas, dependencies or infrastructure when the task is documentation-only.
13. Never claim a feature is implemented unless it exists, the relevant contracts are updated and the behavior has been tested or verified.
14. State uncertainty and blocked work clearly instead of making assumptions.

## Frontend conventions

- Read `DESIGN.md` before UI changes.
- Use the existing design tokens in `apps/web/src/app/globals.css`; do not introduce arbitrary colors, font sizes or spacing values.
- Use `next-intl` for user-facing text. English and Hausa messages belong in `apps/web/messages/`.
- Use the existing API client in `apps/web/src/lib/api.ts` for API requests.
- Use `OrgProvider` and `useOrg()` for organization context.
- Use MapLibre, the existing map components and PMTiles conventions for geospatial views.
- Use ECharts through the existing chart components for time-series visualizations.
- Use Lucide icons rather than emoji or decorative Unicode symbols.
- Preserve accessibility, keyboard navigation, loading states, empty states and error states.

## Backend conventions

- Put request-time API logic in routers and reusable domain logic in appropriate core modules.
- Put long-running provider calls and processing in Celery tasks.
- Use Pydantic schemas for request and response contracts.
- Use structured logging with identifiers that help trace organization, user, field and job activity without exposing sensitive data.
- Use soft deletion where the existing model uses `deleted_at`.
- Add audit events for significant organization, permission, field, sharing and data-management actions.
- Keep external provider calls bounded by timeouts and explicit failure handling.

## Writing style

Applies to documentation, comments, UI strings, commit messages and script output:

- Use concise, direct language.
- Do not use em dashes.
- Do not use emojis or decorative Unicode symbols.
- Avoid unexplained technical jargon.
- Avoid AI-filler wording such as "seamless", "leverage", "delve", "robust" and "empower".
- Explain limitations and uncertainty in plain language.

## Key references

| Purpose | Path |
|---|---|
| Strategic architecture | `ARCHITECTURE.md` |
| Product overview and current features | `README.md` |
| Roadmap and known future work | `ROADMAP.md` |
| Security policy | `SECURITY.md` |
| Deployment and operations | `DEPLOYMENT.md` |
| API entry point | `services/api/app/main.py` |
| Auth and RBAC dependencies | `services/api/app/middleware/auth.py` |
| ORM models | `services/api/app/models/tables.py` |
| Soil intelligence | `services/api/app/core/soil_intelligence.py` |
| Satellite pipeline | `services/api/app/tasks/pipeline.py` |
| Vegetation index registry | `services/api/app/tasks/indices.py` |
| Weather processing | `services/api/app/tasks/weather.py` |
| Soil ingestion | `services/api/app/tasks/soil.py` |
| Frontend API client | `apps/web/src/lib/api.ts` |
| NextAuth configuration | `apps/web/src/lib/auth.ts` |
| Database user upsert | `apps/web/src/lib/db.ts` |
| Docker services | `docker-compose.yml` |

## Changelog guidance

`CHANGELOG.md` is rendered in the application. Follow the existing parser format:

- `## [version] - YYYY-MM-DD`
- `### Added`, `### Fixed`, `### Changed`, `### Security`, `### Deprecated` or `### Removed`
- Plain-text list items

Write changelog entries for non-technical users. Describe what changed for farmers, not internal file paths, migration names, function names, API routes or configuration keys.
