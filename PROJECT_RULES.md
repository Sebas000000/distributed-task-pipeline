# Distributed Task & Event Pipeline Rules (NestJS + BullMQ + Redis)

## 1. Role & Engineering Rigor
- **Role:** Distributed Systems Architect & Lead Engineer.
- **Standards:** Production-grade TypeScript, Clean Architecture, zero `any` types, zero placeholder methods or `// TODO` comments.
- **Reliability:** Idempotent job enqueuing, graceful shutdown for worker processes, resilient Redis connection retry mechanisms, and structured logging.

## 2. Microservices Architecture & Decoupling
- **/backend/api-gateway:**
  - Lightweight HTTP entry point.
  - Exposes REST endpoints with DTO validation (`class-validator`, `class-transformer`).
  - Enqueues jobs into Redis queues using BullMQ producers.
  - Never performs long-running computational work.
  - Returns HTTP 202 (Accepted) for asynchronous task dispatch.
  - Swagger documentation accessible at `/api/docs`.
- **/backend/worker-service:**
  - Headless consumer nodes running BullMQ `Worker` / `@Processor`.
  - Subscribes to distinct queues: `report-gen`, `data-ingest`, `webhooks`.
  - Simulates realistic multi-step processing, logs discrete execution milestones, calculates execution latency, and reports progress from 0% to 100%.
  - Tags every completed/failed job with `assignedWorker` (hostname / worker ID).
  - Handles worker failure scenarios and exponential backoff retry policies.

## 3. Queue & Job Specifications
- **Active Queues:**
  - `report-gen`: Reports generation (`report.monthly`, `report.daily`).
  - `data-ingest`: Batch ingestion and schema verification (`events.batch`, `csv.import`).
  - `webhooks`: External notification delivery (`webhook.deliver`) with retry policies.
- **Job Data Model:**
  - `jobId`: Unique identifier (e.g. `#job-9a8f2c` or UUID-backed id).
  - `queueName`: Target queue name.
  - `payload`: Input JSON payload.
  - `status`: `waiting`, `active`, `completed`, `failed`.
  - `progress`: Number between 0 and 100.
  - `assignedWorker`: Worker identifier (e.g. `worker-01`).
  - `latency`: Total processing time in milliseconds.
  - `logs`: Array of step-by-step timestamped execution logs.

## 4. API Endpoints Contract
- `POST /api/jobs/dispatch`: Accepts `{ queueName, payloadType, payload, priority? }`. Enqueues to Redis and returns HTTP 202 with `jobId`.
- `GET /api/jobs`: Query params `status` (`all` | `active` | `waiting` | `completed` | `failed`), `page`, `limit`. Returns paginated list.
- `GET /api/jobs/:id`: Returns full details of the job across all registered queues.
- `GET /api/cluster/metrics`: Telemetry endpoint reporting total active jobs, waiting jobs, completed jobs, failed jobs, queue counts, and throughput estimates.

## 5. Containerization & Deployment
- Docker Compose v2+ compatible orchestration.
- Official `redis:7-alpine` container with ping healthchecks.
- Multi-stage Dockerfiles with non-root execution where appropriate.
- Environment variable configuration via `.env.example` and standard `.env`.
