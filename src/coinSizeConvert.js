const BN = require("bignumber.js")
const clc = require("cli-color")

const { excel, helpers, data, file, convert } = require("58-toolkit")
const { getExcel } = excel
const { isNumber, decimalPlacesLimit } = helpers
const { minBetList, betLevelList, denomIndexList, denomIndexToDenomString, denomStringToDenomRatio } = data
const { writeAlter } = file
const { convertListToDenomString } = convert

const { betGoldIdMap } = require("./gameDenomBetGold")
const { currencyList } = require("./currency")
const { gameMinBetMap } = require("./gameMinBet")
const { currencyExchangeRateMap } = require("./currencyExchangeRate")

const coinSizeConvertMap = new Map()

/**
 * 魚機遊戲編號
 */
const fishGameIdList = [
  10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10011, 10012, 10014, 10081, 10082, 10083, 200531,
  200532, 200533, 200534, 200535, 200536, 211201,
]

/**
 * 目前排除denom小於 1:100 的條件下，【無法配對】任何一組可用的coin szie設定的幣別
 */
const currencyNoCoinSize = [
  "AUD2",
  "CAD2",
  "CHF2",
  "CNY2",
  "EUR2",
  "GBP2",
  "HKD2",
  "MYR2",
  "NOK2",
  "NZD2",
  "SEK2",
  "SGD2",
  "USD2",
  "ZAR2",
]

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
            if (minBet_ > 0) {
              // @note minBet 為 0 是異常，略過
              coinSizeConvertMap.set(key_, [addCoinSizeValue_])
            } else {
              console.log(`key_: ${key_} minBet_: ${minBet_} 異常，略過...`)
            }
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
    /*
    if (currencyNoCoinSize.includes(curr_)) {
      console.warn(`排除幣別 ${curr_} 因為【無法配對】任何一組可用的coin szie設定`)
      return
    }*/
    const sql_ = mainLoop(curr_, agentCid_)
    allSql_ += sql_
  })
  writeAlter("./output", allSql_, `all_alter.sql`)
}

/**
 * 計算 coin size 的 betLevel、denom
 *
 * @param {*} coinSize
 * @param {*} minBet
 * @returns
 */
function calCoinSize(coinSize, minBet) {
  let ret_
  let isFound_ = false
  betLevelList.forEach((betLevel_) => {
    denomIndexList.forEach((denomIndex_) => {
      if (!isFound_) {
        const denomString_ = denomIndexToDenomString(denomIndex_)
        const denomRatio_ = denomStringToDenomRatio(denomString_)
        if (denomRatio_ >= 0.01 /* @note denom必須大於等於 1:100 */) {
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
      }
    })
  })
  return ret_
}

/**
 * 反算出新的 coin size 數值
 *
 * @param {*} minBet
 * @returns
 */
function reCalCoinSize(currency, minBet, oldCoinSize) {
  const list_ = []
  betLevelList.forEach((betLevel_) => {
    denomIndexList.forEach((denomIndex_) => {
      const denomString_ = denomIndexToDenomString(denomIndex_)
      const denomRatio_ = denomStringToDenomRatio(denomString_)
      if (denomRatio_ >= 0.01 /* @note denom必須大於等於 1:100 */) {
        const calCoinSize_ = BN(minBet).times(denomRatio_).times(betLevel_).toNumber()

        const cryDef_ = currencyExchangeRateMap.get(currency)
        if (cryDef_) {
          const currencyExchangeRate_ = 1 / cryDef_
          const cny_ = calCoinSize_ * currencyExchangeRate_
          if (cny_ >= 0.6 && cny_ <= 200) {
            const reCal_ = {
              minBet,
              betLevel: betLevel_,
              denomIndex: denomIndex_,
              denomString: denomString_,
              coinSize: calCoinSize_,
              absoluteValue: Math.abs(oldCoinSize - calCoinSize_),
              cny: cny_,
            }
            list_.push(reCal_)
          } else {
            //console.error(`不在範圍內 currency: ${currency}, minBet: ${minBet} - CNY 為 ${cny_}`)
          }
        } else {
          console.error(`找不到 currency: ${currency}, minBet: ${minBet} 的匯率`)
        }
      }
    })
  })

  if (list_.length === 0) {
    return null
  }

  const listSort_ = list_.sort(function (a, b) {
    return a.absoluteValue - b.absoluteValue // a - b > 0 小到大【升序】
  })

  return listSort_[0]
}

function mainLoop(currency, agentCid) {
  initCoinSizeConvert(currency)

  let sql_ = `use game;`
  let allSql_ = ""

  //@note 重寫產 SQL 語法
  gameMinBetMap.forEach((v, k) => {
    if (fishGameIdList.includes(Number(v.gameId))) return

    const key_ = `${currency}-${v.minBet}`
    const valueCoinSizeList_ = coinSizeConvertMap.get(key_)
    //
    let isPair = false
    if (valueCoinSizeList_) {
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
            isPair = true
          }
        } else {
          const reCal_ = reCalCoinSize(currency, value_.minBet, value_.coinSize)
          if (reCal_) {
            console.log(
              `✅重新計算 ❌coin size: ${value_.coinSize}, currency: ${currency},  minBet: ${value_.minBet}, gameId: ${v.gameId}`
            )
            console.log(
              `           🉑coin size: ${reCal_.coinSize}, betLevel: ${reCal_.betLevel}, denom: ${reCal_.denomString}/${
                reCal_.denomIndex
              }, CNY: ${reCal_.cny.toFixed(3)}`
            )

            const keyBetGoldId_ = `${reCal_.minBet}-${reCal_.denomIndex}-${reCal_.betLevel}`
            const id_ = betGoldIdMap.get(keyBetGoldId_)
            if (!id_) {
              console.error(
                `無法取得 id: ${id_} currency: ${currency}  minBet: ${value_.minBet}, coin size: ${value_.coinSize}`
              )
            } else {
              //console.log(`minBet: ${value_.minBet} coinSize: ${value_.coinSize} id: ${id_}`)

              idList_.push(id_)
              isPair = true
            }
          } else {
            /*console.error(
              `🈲無法配對 currency: ${currency}  minBet: ${value_.minBet}, ❌coin size: ${value_.coinSize}, gameId: ${v.gameId}`
            )*/
          }
        }
      })

      if (!isPair) {
        console.error(`🈲完全無法配對 currency: ${currency}  minBet: ${v.minBet}, gameId: ${v.gameId}`)
      } else {
        const idListString_ = convertListToDenomString(idList_)

        let defaultId_
        if (idList_.length >= 2) {
          defaultId_ = idList_[1]
        } else {
          defaultId_ = idList_[0]
        }

        sql_ += `\n`
        sql_ += `INSERT INTO game_denom_bet_gold_setting (cId,gameId,currency,groupKey,premadeBetGoldIdList,defaultPremadeBetGoldId) VALUES ('${agentCid}',${v.gameId},'${currency}','','${idListString_}',${defaultId_}) ON DUPLICATE KEY UPDATE premadeBetGoldIdList = '${idListString_}', defaultPremadeBetGoldId = ${defaultId_};`

        allSql_ += `\n`
        allSql_ += `INSERT INTO game_denom_bet_gold_setting (cId,gameId,currency,groupKey,premadeBetGoldIdList,defaultPremadeBetGoldId) VALUES ('${agentCid}',${v.gameId},'${currency}','','${idListString_}',${defaultId_}) ON DUPLICATE KEY UPDATE premadeBetGoldIdList = '${idListString_}', defaultPremadeBetGoldId = ${defaultId_};`
      }
    } else {
      if (v.minBet > 0) {
        // @note minBet 為 0 是異常，略過
        console.log(`k: ${k}, v: ${v.name} MinBet: ${v.minBet} 取不到 key_: ${key_}`)
      }
    }
  })

  writeAlter("./output", sql_, `alter_${currency}.sql`)

  return allSql_
}

module.exports = { coinSizeConvertSQL }
