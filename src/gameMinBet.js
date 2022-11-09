const { excel } = require("58-toolkit")
const { getExcel } = excel

const gameMinBetMap = new Map()

/**
 *
 */
function initGameMinBet() {
  const gameMinBetSheet_ = getExcel("./input/gameMinBet.xlsx", false, "gameMinBet")

  gameMinBetSheet_.forEach((row_) => {
    const gameId_ = row_[0]
    const name_ = row_[2]
    const minBet_ = row_[3]

    if (gameId_ != "gameId") {
      const data_ = {
        gameId: gameId_,
        name: name_,
        minBet: minBet_,
      }
      gameMinBetMap.set(gameId_, data_)
    }
  })
}

module.exports = { initGameMinBet, gameMinBetMap }
