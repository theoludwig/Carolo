import fastifyPlugin from 'fastify-plugin'
import type { ServerOptions } from 'socket.io'
import { Server as SocketIoServer } from 'socket.io'

interface FastifyIo {
  instance: SocketIoServer
}

declare module 'fastify' {
  export interface FastifyInstance {
    io: FastifyIo
  }
}

export default fastifyPlugin(
  async (fastify, options: Partial<ServerOptions>) => {
    const instance = new SocketIoServer(fastify.server, options)
    const io: FastifyIo = {
      instance
    }
    fastify.decorate('io', io)
    fastify.addHook('onClose', (fastify) => {
      fastify.io.instance.close()
    })
  },
  { fastify: '4.x' }
)
