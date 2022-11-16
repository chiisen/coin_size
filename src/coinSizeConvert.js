const { excel, helpers, data, file, convert } = require("58-toolkit")
const { getExcel } = excel
const { isNumber } = helpers
const { minBetList, betLevelList, denomIndexList, denomIndexToDenomString, denomStringToDenomRatio } = data
const { writeAlter } = file
const { convertListToDenomString } = convert

const { betGoldIdMap } = require("./gameDenomBetGold")

const coinSizeConvertMap = new Map()

function initCoinSizeConvert(currency) {
  const coinSizeConvertSheet_ = getExcel("./input/coinSize.xlsx", false, currency)

  coinSizeConvertMap.clear()

  coinSizeConvertSheet_.forEach((row_) => {
    let refIndex_ = 0
    const offset_ = 3
    minBetList.forEach((minBet_) => {
      const coinSizeOffSetIndex_ = refIndex_
      const cnyOffsetIndex_ = refIndex_ + 1

      const coinSize_ = row_[coinSizeOffSetIndex_]
      const cny_ = row_[cnyOffsetIndex_]

      if (isNumber(coinSize_)) {
        const key_ = `${currency}-${minBet_}`
        const coinSizeValue_ = coinSizeConvertMap.get(key_)
        const addCoinSizeValue_ = {
          minBet: minBet_,
          coinSize: coinSize_,
          CNY: cny_,
        }
        if (!coinSizeValue_) {
          coinSizeConvertMap.set(key_, [addCoinSizeValue_])
        } else {
          coinSizeValue_.push(addCoinSizeValue_)
        }
      }

      refIndex_ += offset_
    })
  })
}

function coinSizeConvertSQL() {
  const currency_ = ["KBB", "CNY"]
  currency_.forEach((curr_) => {
    mainLoop(curr_)
  })
}

function calCoinSzie(coinSize, minBet) {
  let ret_
  let isFound_ = false
  betLevelList.forEach((betLevel_) => {
    denomIndexList.forEach((denomIndex_) => {
      if (!isFound_) {
        const denomString_ = denomIndexToDenomString(denomIndex_)
        const denomRatio_ = denomStringToDenomRatio(denomString_)
        const calCoinSzie_ = minBet * betLevel_ * denomRatio_
        if (calCoinSzie_ === coinSize) {
          ret_ = {
            minBet,
            betLevel: betLevel_,
            denomIndex: denomIndex_,
          }
          isFound_ = true
        }
      }
    })
  })
  return ret_
}

function mainLoop(currency) {
  initCoinSizeConvert(currency)

  let sql_ = `use game;`

  coinSizeConvertMap.forEach((valueCoinSizeList_, key_) => {
    const idList_ = []
    valueCoinSizeList_.forEach((value_) => {
      const cal_ = calCoinSzie(value_.coinSize, value_.minBet)
      if (cal_) {
        const keyBetGoldId_ = `${cal_.minBet}-${cal_.denomIndex}-${cal_.betLevel}`
        const id_ = betGoldIdMap.get(keyBetGoldId_)
        if (!id_) {
          console.error(`無法配對 id: ${id_}`)
        } else {
          console.log(`minBet: ${value_.minBet} coinSize: ${value_.coinSize} id: ${id_}`)

          idList_.push(id_)
        }
      } else {
        console.error(`無法配對 minBet: ${value_.minBet}, coin size: ${value_.coinSize}`)
      }
    })

    const idListString_ = convertListToDenomString(idList_)
    const defaultId_ = idList_[1]

    sql_ += `\n`
    sql_ += `INSERT INTO game_denom_bet_gold_setting (cId,gameId,currency,groupKey,premadeBetGoldIdList,defaultPremadeBetGoldId) VALUES ('你指定的AgentCid',171201,'${currency}','你指定的groupKey','${idListString_}',${defaultId_});`
  })

  writeAlter("./output", sql_, `alter_${currency}.sql`)
}

module.exports = { coinSizeConvertSQL }
