const { excel, data } = require("58-toolkit")
const { getExcel } = excel
const { minBetList, betLevelList, denomIndexList, denomIndexToDenomString, denomStringToDenomRatio } = data

const betGoldMap = new Map() // 用 id 查 coin size 的設定
const betGoldIdMap = new Map() // 用 coin size 的組合產生 key 值來查詢在資料庫中的 id

/**
 * 初始化 GameDenomBetGold
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

      const key_ = `${minBet_}-${denomId_}-${betLevel_}`
      betGoldIdMap.set(key_, id_)
    }
  })

  //檢查缺的 coin size 組合
  checkGameDenomBetGold()
}

/**
 * 檢查缺的 coin size 組合
 */
function checkGameDenomBetGold() {
  minBetList.forEach((minBet_) => {
    betLevelList.forEach((betLevel_) => {
      denomIndexList.forEach((denomIndex_) => {
        const denomString_ = denomIndexToDenomString(denomIndex_)
        const denomRatio_ = denomStringToDenomRatio(denomString_)
        const betGold_ = minBet_ * denomRatio_ * betLevel_

        const key_ = `${minBet_}-${denomIndex_}-${betLevel_}`
        if(!betGoldIdMap.get(key_)){
          console.error(`💦缺少組合: ${key_}`)
        }
      })
    })
  })
}

module.exports = { initGameDenomBetGold, betGoldMap, betGoldIdMap }
