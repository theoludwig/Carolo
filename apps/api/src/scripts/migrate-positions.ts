import { Position } from '@carolo/game'

import prisma from '#src/tools/database/prisma.js'

const oldPositionfromString = (positionString: string): Position => {
  const [, column, , row] = positionString.split('-')
  return new Position({
    column: parseInt(column ?? '0', 10),
    row: parseInt(row ?? '0', 10)
  })
}

await prisma.game.deleteMany({
  where: {
    status: 'PLAY'
  }
})

const gameActions = await prisma.gameAction.findMany()

await Promise.all(
  gameActions.map(async (gameAction) => {
    if (gameAction.fromPosition === null || gameAction.toPosition === null) {
      return
    }
    const isOldNotation = gameAction.fromPosition.includes('-')
    if (!isOldNotation) {
      return
    }
    await prisma.gameAction.update({
      where: {
        id: gameAction.id
      },
      data: {
        fromPosition: oldPositionfromString(gameAction.fromPosition).toString(),
        toPosition: oldPositionfromString(gameAction.toPosition).toString()
      }
    })
  })
)
