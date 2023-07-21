# Carolo

## À propos

Le [Carolo](https://carolo.theoludwig.fr/), est un jeu de plateau stratégique similaire aux échecs qui permet des coups grandioses, reposant sur des enchaînements remarquables.

[Règles du jeu Carolo](./apps/website/public/rules/carolo-fr-FR.pdf).

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
npm install

# Configure the environment variables inside `apps/api` and `apps/website`
cp apps/api/.env.example apps/api/.env
cp apps/website/.env.example apps/website/.env
```

### Database Setup

```sh
# Create a new user and database
psql
create database carolo_database;
create user carolo_user with encrypted password 'password';
ALTER USER carolo_user WITH SUPERUSER;
```

Replace `DATABASE_URL` inside `apps/api/.env` with `postgresql://carolo_user:password@127.0.0.1:5432/carolo_database`.

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

# Run Prisma migrations
docker compose exec carolo-api npm run prisma:migrate:deploy
```

## 💡 Contributing

Anyone can help to improve the project, submit a Feature Request, a bug report or even correct a simple spelling mistake.

The steps to contribute can be found in the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

## 📄 License

[MIT](./LICENSE)
