
const clc = require("cli-color")

const { getExcel } = require("./excel")

const gameDenomBetGoldSheet_ = getExcel("./input/game_denom_bet_gold.xlsx", false, "game_denom_bet_gold")
const betGoldList_ = []
gameDenomBetGoldSheet_.forEach((row_) => {
  const id_ = row_[0]

  if (id_ != "id") {
    betGoldList_.push(id_)
  }
})

console.log(clc.red("程式結束!"))