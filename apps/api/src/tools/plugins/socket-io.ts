import type { Game as GameModel } from "@carolo/models"
import fastifyPlugin from "fastify-plugin"
import type { ServerOptions } from "socket.io"
import { Server as SocketIoServer } from "socket.io"

interface FastifyIo {
  instance: SocketIoServer
}

declare module "fastify" {
  export interface FastifyInstance {
    io: FastifyIo
  }
}

export default fastifyPlugin(
  async (fastify, options: Partial<ServerOptions>) => {
    const instance = new SocketIoServer(fastify.server, options)
    const io: FastifyIo = {
      instance,
    }
    io.instance.on("connection", (socket) => {
      socket.on("game:join", async (gameId: GameModel["id"]) => {
        await socket.join(`game:${gameId}`)
      })
    })
    fastify.decorate("io", io)
    fastify.addHook("onClose", (fastify) => {
      fastify.io.instance.close()
    })
  },
  { fastify: "4.x" },
)
