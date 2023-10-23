import type { Static } from "@sinclair/typebox"
import { Type } from "@sinclair/typebox"

import { gameSchema, gameUserSchemaObject, pieceColors } from "../Game.js"
import {
  gameActionBasicSchemaObject,
  gameActionSchemaObject,
} from "../GameAction.js"

export const gamesServiceSchema = {
  "/games": {
    post: {
      body: Type.Object({
        color: Type.Union(pieceColors),
      }),
      response: Type.Object({
        gameId: gameSchema.id,
      }),
    },
  },
  "/games/current": {
    get: {
      response: Type.Object({
        gameId: Type.Union([gameSchema.id, Type.Null()]),
      }),
    },
  },
  "/games/:gameId/join": {
    post: {
      parameters: Type.Object({
        gameId: gameSchema.id,
      }),
      response: gameUserSchemaObject,
    },
  },
  "/games/:gameId/actions": {
    post: {
      parameters: Type.Object({
        gameId: gameSchema.id,
      }),
      body: gameActionBasicSchemaObject,
      response: gameActionSchemaObject,
    },
  },
  "/games/:gameId": {
    get: {
      parameters: Type.Object({
        gameId: gameSchema.id,
      }),
      response: Type.Object({
        id: gameSchema.id,
        status: gameSchema.status,
        playerWhiteId: gameSchema.playerWhiteId,
        playerBlackId: gameSchema.playerBlackId,
        playerWhite: Type.Union([gameUserSchemaObject, Type.Null()]),
        playerBlack: Type.Union([gameUserSchemaObject, Type.Null()]),
        actions: Type.Array(gameActionBasicSchemaObject),
      }),
    },
  },
} as const

export interface GamesServices {
  "/games": {
    post: {
      body: Static<(typeof gamesServiceSchema)["/games"]["post"]["body"]>
      response: Static<
        (typeof gamesServiceSchema)["/games"]["post"]["response"]
      >
    }
  }
  "/games/current": {
    get: {
      response: Static<
        (typeof gamesServiceSchema)["/games/current"]["get"]["response"]
      >
    }
  }
  "/games/:gameId/join": {
    post: {
      parameters: Static<
        (typeof gamesServiceSchema)["/games/:gameId/join"]["post"]["parameters"]
      >
      response: Static<
        (typeof gamesServiceSchema)["/games/:gameId/join"]["post"]["response"]
      >
    }
  }
  "/games/:gameId/actions": {
    post: {
      parameters: Static<
        (typeof gamesServiceSchema)["/games/:gameId/actions"]["post"]["parameters"]
      >
      body: Static<
        (typeof gamesServiceSchema)["/games/:gameId/actions"]["post"]["body"]
      >
      response: Static<
        (typeof gamesServiceSchema)["/games/:gameId/actions"]["post"]["response"]
      >
    }
  }
  "/games/:gameId": {
    get: {
      parameters: Static<
        (typeof gamesServiceSchema)["/games/:gameId"]["get"]["parameters"]
      >
      response: Static<
        (typeof gamesServiceSchema)["/games/:gameId"]["get"]["response"]
      >
    }
  }
}
