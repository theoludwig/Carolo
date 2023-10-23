import type { Static } from "@sinclair/typebox"
import { Type } from "@sinclair/typebox"

export const date = {
  createdAt: Type.String({
    format: "date-time",
    description: "Created date time",
  }),
  updatedAt: Type.String({
    format: "date-time",
    description: "Last updated date time",
  }),
}

export const id = Type.Integer({ minimum: 1, description: "Unique identifier" })

export const redirectURI = Type.String({ format: "uri-reference" })

export const queryPaginationSchema = {
  /** Maximum number of items to return */
  limit: Type.Integer({ default: 20, minimum: 1, maximum: 100 }),

  /** The before and after are mutually exclusive, only one may be passed at a time. */
  before: Type.Optional(
    Type.String({ description: "Get items before this id" }),
  ),
  after: Type.Optional(Type.String({ description: "Get items after this id" })),
}

export const queryPaginationObjectSchema = Type.Object(queryPaginationSchema)

export type QueryPaginationSchemaType = Static<
  typeof queryPaginationObjectSchema
>

export const fastifyErrorsSchema = {
  400: {
    statusCode: Type.Literal(400),
    error: Type.Literal("Bad Request"),
    message: Type.String(),
  },
  401: {
    statusCode: Type.Literal(401),
    error: Type.Literal("Unauthorized"),
    message: Type.Literal("Unauthorized"),
  },
  403: {
    statusCode: Type.Literal(403),
    error: Type.Literal("Forbidden"),
    message: Type.Literal("Forbidden"),
  },
  404: {
    statusCode: Type.Literal(404),
    error: Type.Literal("Not Found"),
    message: Type.String(),
  },
  429: {
    statusCode: Type.Literal(429),
    error: Type.Literal("Too Many Requests"),
    message: Type.String(),
  },
  431: {
    statusCode: Type.Literal(431),
    error: Type.Literal("Request Header Fields Too Large"),
    message: Type.String(),
  },
  500: {
    statusCode: Type.Literal(500),
    error: Type.Literal("Internal Server Error"),
    message: Type.Literal("Something went wrong"),
  },
}

export const fastifyErrors = {
  400: Type.Object(fastifyErrorsSchema[400]),
  401: Type.Object(fastifyErrorsSchema[401]),
  403: Type.Object(fastifyErrorsSchema[403]),
  404: Type.Object(fastifyErrorsSchema[404]),
  429: Type.Object(fastifyErrorsSchema[429]),
  431: Type.Object(fastifyErrorsSchema[431]),
  500: Type.Object(fastifyErrorsSchema[500]),
}
