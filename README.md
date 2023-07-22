# Carolo

## About

The [Carolo](https://carolo.theoludwig.fr/), is a strategy board game similar to chess which allows grandiose moves, based on remarkable sequences.

[Game rules (French)](./apps/website/public/rules/carolo-fr-FR.pdf).

> **Note**
>
> Only available in French for the moment.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20.0.0
- [npm](https://www.npmjs.com/) >= 9.0.0
- [PostgreSQL](https://www.postgresql.org/) >= 15.0.0

### Installation

```sh
# Go to the project root
cd Carolo

# Install dependencies
npm clean-install

# Configure the environment variables inside `apps/api` and `apps/website`
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/website/.env.example apps/website/.env
```

### Database Setup

```sh
# Create a new user and database
psql
CREATE DATABASE carolo;
CREATE USER carolo_user with encrypted password 'password';
ALTER USER carolo_user WITH SUPERUSER;
```

### Database Production migration

```sh
npm run prisma:migrate:deploy --workspace=apps/api
```

### Local Development environment

Recommended to use [VSCode: Remote development in Containers](https://code.visualstudio.com/docs/remote/containers-tutorial).

#### Database Development migration

```sh
# Run Prisma migrations
npm run prisma:migrate:dev --workspace=apps/api

# Reset the database (WARNING: This will delete all data)
npm run prisma:migrate:reset --workspace=apps/api
```

#### Usage

```sh
npm run dev
```

##### Services started

- `apps/website`: <http://127.0.0.1:3000>
- `apps/api`: <http://127.0.0.1:8080>
- [Maildev](https://maildev.github.io/maildev/): <http://127.0.0.1:1080>
- [Prisma Studio](https://www.prisma.io/studio): <http://127.0.0.1:5555>

##### Commands

```sh
# Build, Lint and Test
npm run build
npm run lint
npm run lint:editorconfig
npm run lint:prettier
npm run test

# Test only one workspace (e.g: `apps/api`)
npm run test --workspace=apps/api
```

### Production environment (with [Docker](https://www.docker.com/))

```sh
docker compose up --build
```

## 💡 Contributing

Anyone can help to improve the project, submit a Feature Request, a bug report or even correct a simple spelling mistake.

The steps to contribute can be found in the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

## 📄 License

[MIT](./LICENSE)
