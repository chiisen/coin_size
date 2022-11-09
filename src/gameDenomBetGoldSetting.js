const { excel } = require("58-toolkit")
const { getExcel } = excel

const betGoldSettingMap = new Map()

/**
 *
 */
function initGameDenomBetGoldSetting() {
  const gameDenomBetGoldSettingSheet_ = getExcel(
    "./input/game_denom_bet_gold_setting.xlsx",
    false,
    "game_denom_bet_gold_setting"
  )

  gameDenomBetGoldSettingSheet_.forEach((row_) => {
    const gameId_ = row_[1]
    const currency_ = row_[2]
    const premadeBetGoldIdList_ = row_[3]
    const defaultPremadeBetGoldId_ = row_[4]

    if (gameId_ != "gameId") {
      const data_ = {
        gameId: gameId_,
        currency: currency_,
        premadeBetGoldIdList: premadeBetGoldIdList_,
        defaultPremadeBetGoldId: defaultPremadeBetGoldId_,
      }
      const key_ = `${gameId_}-${currency_}`
      betGoldSettingMap.set(key_, data_)
    }
  })
}

module.exports = { initGameDenomBetGoldSetting, betGoldSettingMap }
