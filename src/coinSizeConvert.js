const BN = require("bignumber.js")

const { excel, helpers, data, file, convert } = require("58-toolkit")
const { getExcel } = excel
const { isNumber, decimalPlacesLimit } = helpers
const { minBetList, betLevelList, denomIndexList, denomIndexToDenomString, denomStringToDenomRatio } = data
const { writeAlter } = file
const { convertListToDenomString } = convert

const { betGoldIdMap } = require("./gameDenomBetGold")
const { currencyList } = require("./currency")
const { gameMinBetMap } = require("./gameMinBet")

const coinSizeConvertMap = new Map()

/**
 * 初始化 coin size 的設定表
 *
 * @param {string} currency 幣別
 */
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
        if (coinSize_ != 0) {
          if (decimalPlacesLimit(coinSize_, 2)) {
            console.error(`currency: ${currency} minBet: ${minBet_} coinSize: ${coinSize_} 小於小數點兩位`)
          }
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
        } else {
          // 等於 coin size 零的忽略掉
        }
      }

      refIndex_ += offset_
    })
  })
}

/**
 * 依據幣別產生所有的 coin size 的 SQL 腳本
 */
function coinSizeConvertSQL() {
  const agentCid_ = `你指定的AgentCid`
  let allSql_ = `use game;`
  currencyList.forEach((curr_) => {
    const sql_ = mainLoop(curr_, agentCid_)
    allSql_ += sql_
  })
  writeAlter("./output", allSql_, `all_alter.sql`)
}

function calCoinSize(coinSize, minBet) {
  let ret_
  let isFound_ = false
  betLevelList.forEach((betLevel_) => {
    denomIndexList.forEach((denomIndex_) => {
      if (!isFound_) {
        const denomString_ = denomIndexToDenomString(denomIndex_)
        const denomRatio_ = denomStringToDenomRatio(denomString_)
        const calCoinSize_ = BN(minBet).times(denomRatio_).times(betLevel_).toNumber()
        if (calCoinSize_ === coinSize) {
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

function mainLoop(currency, agentCid) {
  initCoinSizeConvert(currency)

  let sql_ = `use game;`
  let allSql_ = ''

  //@note 重寫產 SQL 語法
  gameMinBetMap.forEach((v, k) => {
    const key_ = `${currency}-${v.minBet}`
    const valueCoinSizeList_ = coinSizeConvertMap.get(key_)
    const idList_ = []
    valueCoinSizeList_.forEach((value_) => {
      const cal_ = calCoinSize(value_.coinSize, value_.minBet)
      if (cal_) {
        const keyBetGoldId_ = `${cal_.minBet}-${cal_.denomIndex}-${cal_.betLevel}`
        const id_ = betGoldIdMap.get(keyBetGoldId_)
        if (!id_) {
          console.error(
            `無法取得 id: ${id_} currency: ${currency}  minBet: ${value_.minBet}, coin size: ${value_.coinSize}`
          )
        } else {
          //console.log(`minBet: ${value_.minBet} coinSize: ${value_.coinSize} id: ${id_}`)

          idList_.push(id_)
        }
      } else {
        console.error(`🈲無法配對 currency: ${currency}  minBet: ${value_.minBet}, coin size: ${value_.coinSize}`)
      }
    })

    const idListString_ = convertListToDenomString(idList_)
    const defaultId_ = idList_[1]

    sql_ += `\n`
    sql_ += `INSERT INTO game_denom_bet_gold_setting (cId,gameId,currency,premadeBetGoldIdList,defaultPremadeBetGoldId) VALUES ('${agentCid}',${v.gameId},'${currency}','${idListString_}',${defaultId_});`

    allSql_ += `\n`
    allSql_ += `INSERT INTO game_denom_bet_gold_setting (cId,gameId,currency,premadeBetGoldIdList,defaultPremadeBetGoldId) VALUES ('${agentCid}',${v.gameId},'${currency}','${idListString_}',${defaultId_});`
  })

  writeAlter("./output", sql_, `alter_${currency}.sql`)

  return allSql_
}

module.exports = { coinSizeConvertSQL }
