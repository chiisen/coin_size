const { Big: B } = require("big.js")

const { data, file } = require("58-toolkit")
const { minBetList, betLevelList, denomIndexList, denomIndexToDenomString, denomStringToDenomRatio } = data
const { writeAlter } = file

const { betGoldIdMap } = require("./gameDenomBetGold")

/**
 * 檢查缺的 coin size 組合
 */
function checkGameDenomBetGold() {
  const newBetGoldId_ = []
  let id_ = 2856 // 目前有 2855 筆資料，所以從 2856 款開始
  minBetList.forEach((minBet_) => {
    betLevelList.forEach((betLevel_) => {
      denomIndexList.forEach((denomIndex_) => {
        const key_ = `${minBet_}-${denomIndex_}-${betLevel_}`
        if (!betGoldIdMap.get(key_)) {
          const denomString_ = denomIndexToDenomString(denomIndex_)
          const denomRatio_ = denomStringToDenomRatio(denomString_)
          const betGold_ = B(minBet_).times(denomRatio_).times(betLevel_).toNumber()
          const data_ = {
            id: id_,
            minBet: minBet_,
            denomId: denomIndex_,
            betLevel: betLevel_,
            betGold: betGold_,
          }
          newBetGoldId_.push(data_)

          id_ += 1
        }
      })
    })
  })

  let sql_ = `use game;`
  newBetGoldId_.forEach((x) => {
    const key_ = `${x.minBet}-${x.denomId}-${x.betLevel}`
    //betGoldIdMap.set(key_, x.id) // @note 暫時改成不寫新增看看能不能組出來，目前看起來沒問題

    sql_ += `\n`

    sql_ += `INSERT INTO game_denom_bet_gold (id,minBet,denomId,betLevel,betGold) VALUES (${x.id},${x.minBet},${x.denomId},${x.betLevel},${x.betGold});`
  })
  writeAlter("./output", sql_, `diff.sql`)
}

module.exports = { checkGameDenomBetGold }
