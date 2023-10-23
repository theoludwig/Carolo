import { application } from "#src/application.js"
import { HOST, PORT } from "#src/tools/configurations.js"
import { GameRepository } from "#src/tools/repositories/GameRepository.js"

console.log("Loading GameRepository from database...")
const games = GameRepository.getInstance()
await games.loadFromDatabase()
console.log("GameRepository loaded.")

const address = await application.listen({
  port: PORT,
  host: HOST,
})
console.log(`API listening at ${address}`)
