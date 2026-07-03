<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Pokédex API

A REST API for managing Pokémon, built with [NestJS](https://nestjs.com/) and MongoDB. Supports full CRUD, pagination, and lookup by Mongo ID, number, or name, plus a seed endpoint that populates the database from the public [PokeAPI](https://pokeapi.co/).

## Tech stack

- **NestJS 11** + **TypeScript**
- **MongoDB** with **Mongoose** (`@nestjs/mongoose`)
- **class-validator** / **class-transformer** for request validation
- **Joi** for environment variable validation
- **Axios** for consuming the PokeAPI
- **Docker** for local development and production

## Getting started

1. Clone the repository and install dependencies:

   ```bash
   pnpm install
   ```

2. Create your environment file from the template:

   ```bash
   cp .env.example .env
   ```

3. Start a local MongoDB instance with Docker:

   ```bash
   docker compose up -d
   ```

4. Run the application in watch mode:

   ```bash
   pnpm run start:dev
   ```

The API will be available at `http://localhost:3001/api/v1`.

5. (Optional) Seed the database with Pokémon from the PokeAPI:

   ```
   GET http://localhost:3001/api/v1/seed
   ```

## Environment variables

| Variable        | Description                          | Default |
| --------------- | ------------------------------------ | ------- |
| `MONGODB_URI`   | MongoDB connection string (required) | —       |
| `PORT`          | Port the app listens on              | `3001`  |
| `DEFAULT_LIMIT` | Default page size for listings       | `10`    |

## API endpoints

All routes are prefixed with `/api/v1`.

| Method   | Endpoint          | Description                                      |
| -------- | ----------------- | ------------------------------------------------ |
| `GET`    | `/seed`           | Wipe and repopulate the DB from the PokeAPI      |
| `POST`   | `/pokemons`       | Create a Pokémon                                 |
| `GET`    | `/pokemons`       | List Pokémon (supports `?limit=` and `?offset=`) |
| `GET`    | `/pokemons/:term` | Find one by Mongo ID, number, or name            |
| `PATCH`  | `/pokemons/:term` | Update a Pokémon                                 |
| `DELETE` | `/pokemons/:term` | Delete a Pokémon                                 |

## Scripts

```bash
# development (watch mode)
pnpm run start:dev

# production build
pnpm run build
pnpm run start:prod

# tests
pnpm run test       # unit tests
pnpm run test:e2e   # e2e tests
pnpm run test:cov   # coverage

# lint & format
pnpm run lint
pnpm run format
```

## Production build

Build and run the full stack (app + MongoDB) with the production compose file:

```bash
docker compose -f docker-compose.prod.yaml up --build
```

Optionally, you can create a `.env.production.local` file in the root with the same variables of the `.env` file and pass it to the docker command. This way, you'll use specific variables for the production build.

```bash
docker compose -f docker-compose.prod.yaml --env-file .env.production.local up --build
```

## License

This project is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
