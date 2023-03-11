import prisma from '#src/tools/database/prisma.js'

for (let iteration = 0; iteration < 100; iteration++) {
  const winner = Math.random() > 0.5 ? 'BLACK' : 'WHITE'
  const loser = winner === 'BLACK' ? 'WHITE' : 'BLACK'
  const playerBlackId = Math.floor(Math.random() * 2) + 1
  const playerWhiteId = playerBlackId === 1 ? 2 : 1
  const game = await prisma.game.create({
    data: {
      playerBlackId,
      playerWhiteId,
      status: `${winner}_WON`
    }
  })
  await prisma.gameAction.create({
    data: {
      type: 'MOVE',
      gameId: game.id,
      fromPosition: 'F1',
      toPosition: 'E3'
    }
  })
  await prisma.gameAction.create({
    data: {
      type: 'RESIGN',
      gameId: game.id,
      color: loser
    }
  })
}
