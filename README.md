# Sports Simulation API

A backend application built with **NestJS** that simulates real-time football matches.

The system exposes a REST API for controlling the simulation lifecycle and uses **WebSockets** to stream live score
updates to clients.

---

## ⚽ Simulated Matches

The simulation includes three fixed matches:

- Germany vs Poland
- Brazil vs Mexico
- Argentina vs Uruguay

---

## 🚀 Features

- Start, finish and restart a simulation
- Strict validation of simulation name
- Start throttling (max once per 5 seconds)
- Deterministic 9-second simulation lifecycle
- Exactly **1 goal per second**, assigned randomly
- Real-time updates via WebSocket
- In-memory state (as required)
- Unit and E2E test coverage

---

## 🧱 Architecture

The application is structured using a layered approach to separate concerns and keep the domain logic independent from
framework-specific details.

```text
src/
  simulation/
    domain/         -> entities, value objects, domain errors
    application/    -> services, orchestration, ports
    infrastructure/ -> external implementations (e.g. random generator)
    interface/      -> HTTP controllers, DTOs, WebSocket gateway
```

### Why this structure?

- **Domain layer** contains pure business logic with no NestJS or I/O concerns
- **Application layer** orchestrates use cases such as start, finish and restart
- **Infrastructure layer** provides external implementations such as the random generator
- **Interface layer** exposes the system through HTTP and WebSocket

This keeps the core logic:

- testable
- framework-agnostic
- easy to extend

---

## ⚙️ Technology Choices

### NestJS

Chosen for:

- built-in dependency injection
- modular architecture
- WebSocket support out of the box
- high testability

### TypeScript

Used for:

- strong typing
- safer refactoring
- clearer contracts between layers

### WebSockets (Socket.IO)

Used to:

- stream score updates in real time
- avoid inefficient polling

REST is used for **commands**, while WebSocket is used for **events**.

### In-Memory Storage

Chosen intentionally to:

- match task requirements
- avoid unnecessary complexity
- focus on core logic and architecture

---

## ⏱ Simulation Rules

- Simulation lasts **9 seconds**
- A goal is scored **every second**
- First goal is scored at second 1, last goal at second 9
- Each goal is assigned randomly to one team
- Simulation can be finished manually before completion
- If not finished manually, it ends automatically

---

## 🚦 Constraints

- Simulation name must:
    - be 8-30 characters long
    - contain only letters, digits and spaces

- Simulation cannot be started more than once within **5 seconds**

---

## 🔌 API

Base URL:

```text
http://localhost:3000/api
```

### Start Simulation

```text
POST /simulation/start
```

Request body:

```json
{
  "name": "Katar 2023"
}
```

### Finish Simulation

```text
POST /simulation/finish
```

### Restart Simulation

```text
POST /simulation/restart
```

### Get Current State

```text
GET /simulation
```

---

## 🔄 WebSocket

Namespace:

```text
/simulation
```

### Events

- `simulation.started`
- `simulation.score.updated`
- `simulation.finished`
- `simulation.restarted`

Each event emits the full simulation snapshot.

---

## 🧪 Tests

### Run unit tests

```bash
npm run test
```

### Run coverage

```bash
npm run test:cov
```

### Run E2E tests

```bash
npm run test:e2e
```

---

## ▶️ Running the Application

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run start:dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## Environment Variables

The application supports the following optional environment variables:

- `API_PORT` – port on which the server will run (default: 3000)

## 📌 Design Decisions

### Value Object for Simulation Name

Encapsulates validation rules inside the domain layer to prevent invalid state.

### Scheduler Service

Isolates time-based behavior from business logic for better testability.

### Random Generator as Port

Allows deterministic testing by replacing randomness with controlled values.

### Thin WebSocket Gateway

The gateway only emits events, while business logic stays in the application layer.

### Global Exception Filter

Maps domain errors into consistent HTTP responses.

---

## ⚠️ Known Limitations

- Single simulation instance (in-memory)
- No persistence
- No horizontal scaling
- WebSocket events are broadcast globally and do not use rooms

These are intentional and aligned with the scope of the task.

---

## 🔮 Future Improvements

### Scalability

- Support multiple concurrent simulations
- Distributed state management

### Persistence

- Database integration (e.g. PostgreSQL)
- Event sourcing or audit log

### Caching & Performance

- Redis for caching and pub/sub
- Distributed scheduler

### Observability

- Structured logging
- Metrics
- Distributed tracing

### API Enhancements

- Swagger / OpenAPI documentation
- Authentication and authorization

### Code Quality

- TSDoc for public APIs
- Stricter linting rules
- Contract testing

---

## 🧠 Final Notes

This implementation focuses on:

- clean separation of concerns
- strong testability
- correct handling of time-based logic
- real-time data delivery

The goal was not to over-engineer, but to provide a **clean and extensible foundation** that could evolve into a
production-grade system.
