const BN = require("bignumber.js")

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
        const denomString_ = denomIndexToDenomString(denomIndex_)
        const denomRatio_ = denomStringToDenomRatio(denomString_)
        const betGold_ = minBet_ * denomRatio_ * betLevel_

        const key_ = `${minBet_}-${denomIndex_}-${betLevel_}`
        if (!betGoldIdMap.get(key_)) {
          const checkBetGold_ = betGold_.toFixed(2)
          if (checkBetGold_ != 0) {
            const data_ = {
              id: id_,
              minBet: minBet_,
              denomId: denomIndex_,
              betLevel: betLevel_,
              betGold: betGold_,
            }
            newBetGoldId_.push(data_)

            id_ += 1
          } else {
            console.error(`💦minBet: ${minBet_}-denomIndex: ${denomIndex_}-betLevel: ${betLevel_} 的 coin size: ${betGold_} 小於小數點兩位`)
          }

          //console.error(`💦缺少組合: ${key_}`)
        }
      })
    })
  })

  let sql_ = `use game;`
  newBetGoldId_.forEach((x) => {
    sql_ += `\n`

    sql_ += `INSERT INTO game_denom_bet_gold (id,minBet,denomId,betLevel,betGold) VALUES (${x.id},${x.minBet},${x.denomId},${x.betLevel},${x.betGold});`
  })
  writeAlter("./output", sql_, `alter_diff.sql`)
}

module.exports = { checkGameDenomBetGold }
