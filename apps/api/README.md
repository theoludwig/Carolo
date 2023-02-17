# @carolo/api

## About

Carolo Application Programming Interface (API).

Documentation: <http://localhost:8080/documentation>

## Directory Structure

```text
├── email
├── prisma
└── src
    ├── models
    ├── scripts
    ├── services
    ├── tools
    └── typings
```

### Each folder explained

- `email` : email template(s) and translation(s)
- `prisma` : contains the prisma schema and migrations
- `src` : all source files
  - `models` : models that represent tables in database as JSON schema
  - `scripts` : scripts
  - `services` : all REST API endpoints
  - `tools` : configs and utilities
  - `typings` : types gloablly used in the project

### Services folder explained with an example

We have API REST services for the `channels`.

Here is what potentially look like a folder structure for this service :

```text
└── src
    └── services
        └── channels
            ├── __test__
            │   └── get.test.ts
            ├── [channelId]
            │   ├── __test__
            │   │   ├── delete.test.ts
            │   │   └── put.test.ts
            │   ├── delete.ts
            │   ├── index.ts
            │   └── put.ts
            ├── get.ts
            └── index.ts
```

This folder structure will map to these REST API routes :

- GET `/channels`
- DELETE `/channels/:channelId`
- PUT `/channels/:channelId`

The folders after `src/services` : is the real path of the routes in the API except
folders starting and ending with `__` like `__test__` or `__utils__`.

The filenames correspond to the HTTP methods used (`get`, `post`, `put`, `delete`).
