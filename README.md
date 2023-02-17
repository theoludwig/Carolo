# Carolo

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- [npm](https://www.npmjs.com/) >= 8.0.0
- [PostgreSQL](https://www.postgresql.org/)

### Installation

```sh
# Clone the repository
git clone git@gitlab.com:caroloaf/Carolo.git

# Go to the project root
cd Carolo

# Install dependencies
npm install

# Configure the environment variables inside `apps/api` and `apps/website`
cp apps/api/.env.example apps/api/.env
cp apps/website/.env.example apps/website/.env
```

### Local Development environment

Recommended to use [VSCode: Remote development in Containers](https://code.visualstudio.com/docs/remote/containers-tutorial) to skip the setup of the database.

#### Setup Database

```sh
# Create a new user and database
psql
create database carolo_database;
create user carolo_user with encrypted password 'password';
ALTER USER carolo_user WITH SUPERUSER;
```

Replace `DATABASE_URL` inside `apps/api/.env` with `postgresql://carolo_user:password@localhost:5432/carolo_database`

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

- website: <http://localhost:3000>
- api: <http://localhost:8080>
- [Maildev](https://maildev.github.io/maildev/): <http://localhost:1080>
- [Prisma Studio](https://www.prisma.io/studio): <http://localhost:5555>

##### Commands

```sh
# Build, Lint and Test
npm run build
npm run lint
npm run test

# Test only one workspace (e.g: `apps/api`)
npm run test --workspace=apps/api
```
