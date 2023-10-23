import type { QueryPaginationSchemaType } from "@carolo/models"
import type { Prisma } from "@prisma/client"

export const getPaginationOptions = (
  query: QueryPaginationSchemaType,
): Prisma.SelectSubset<unknown, unknown> => {
  return {
    take: query.before != null ? query.limit * -1 : query.limit,
    skip: query.after != null || query.before != null ? 1 : undefined,
    ...(query.after != null && {
      cursor: {
        id: query.after,
      },
    }),
    ...(query.before != null && {
      cursor: {
        id: query.before,
      },
    }),
  }
}
