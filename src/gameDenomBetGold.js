const clc = require("cli-color")

const { getExcel } = require("./excel")

const betGoldMap = new Map()

/**
 *
 */
function initGameDenomBetGold() {
  const gameDenomBetGoldSheet_ = getExcel("./input/game_denom_bet_gold.xlsx", false, "game_denom_bet_gold")

  gameDenomBetGoldSheet_.forEach((row_) => {
    const id_ = row_[0]
    const minBet_ = row_[1]
    const denomId_ = row_[2]
    const betLevel_ = row_[3]
    const betGold_ = row_[4]

    if (id_ != "id") {
      const data_ = {
        id: id_,
        minBet: minBet_,
        denomId: denomId_,
        betLevel: betLevel_,
        betGold: betGold_,
      }
      betGoldMap.set(id_, data_)
    }
  })
}

module.exports = { initGameDenomBetGold, betGoldMap }
