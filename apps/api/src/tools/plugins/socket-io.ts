import fastifyPlugin from 'fastify-plugin'
import type { ServerOptions } from 'socket.io'
import { Server as SocketIoServer } from 'socket.io'
import { authorize } from '@thream/socketio-jwt'

import { JWT_ACCESS_SECRET } from '#src/tools/configurations.js'

interface EmitEventOptions {
  event: string
  payload: {
    action: 'create' | 'delete' | 'update'
    item: object
  }
}

interface EmitToAuthorizedUsersOptions extends EmitEventOptions {
  /** tests whether the current connected userId is authorized to get the event, if the callback returns true, the server will emit the event to that user */
  isAuthorizedCallback: (userId: number) => Promise<boolean> | boolean
}

type EmitToAuthorizedUsers = (
  options: EmitToAuthorizedUsersOptions
) => Promise<void>

interface FastifyIo {
  instance: SocketIoServer
  emitToAuthorizedUsers: EmitToAuthorizedUsers
}

declare module 'fastify' {
  export interface FastifyInstance {
    io: FastifyIo
  }
}

export default fastifyPlugin(
  async (fastify, options: Partial<ServerOptions>) => {
    const instance = new SocketIoServer(fastify.server, options)
    instance.use(
      authorize({
        secret: JWT_ACCESS_SECRET
      })
    )
    const emitToAuthorizedUsers: EmitToAuthorizedUsers = async (options) => {
      const { event, payload, isAuthorizedCallback } = options
      const clients = await instance.sockets.allSockets()
      for (const clientId of clients) {
        const client = instance.sockets.sockets.get(clientId)
        if (client != null) {
          const userId = client.decodedToken.id
          const isAuthorized = await isAuthorizedCallback(userId)
          if (isAuthorized) {
            client.emit(event, payload)
          }
        }
      }
    }
    const io: FastifyIo = {
      instance,
      emitToAuthorizedUsers
    }
    fastify.decorate('io', io)
    fastify.addHook('onClose', (fastify) => {
      fastify.io.instance.close()
    })
  },
  { fastify: '4.x' }
)
