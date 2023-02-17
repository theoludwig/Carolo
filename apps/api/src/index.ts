import { application } from '#src/application.js'
import { HOST, PORT } from '#src/tools/configurations.js'

const address = await application.listen({
  port: PORT,
  host: HOST
})
console.log(`API listening at ${address}`)
