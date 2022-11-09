const clc = require("cli-color")

const { betGoldMap } = require("./gameDenomBetGold")
const { betGoldSettingMap } = require("./gameDenomBetGoldSetting")
const { gameMinBetMap } = require("./gameMinBet")
const {
  minBetToExcelDenomListMap,
  minBetCurrencyToDefaultDenomIndexMap,
  minBetCurrencyToDefaultDenomNthMap,
} = require("./minBet")

const { data, convert } = require("58-toolkit")
const { denomIndexToDenomString } = data
const { convertExcelToDenomList, convertExcelToExcelDenomList, convertListToDenomString, convertListToDenomConvertString } = convert

/**
 *
 */
function output() {
  betGoldSettingMap.forEach((v, k) => {
    const betGoldIdList_ = v.premadeBetGoldIdList.split(",")
    let denomString_ = ""
    betGoldIdList_.forEach((id_) => {
      const nId_ = Number(id_)
      const val_ = betGoldMap.get(nId_)
      const denom_ = denomIndexToDenomString(val_.denomId)
      denomString_ += `${denom_}(${val_.denomId})[${val_.betGold.toString()}],` + "\n"
    })
    const gameMinBet_ = gameMinBetMap.get(v.gameId)
    if (!gameMinBet_) {
      console.error(`gameId: ${v.gameId} not fond.`)
      console.log(clc.blue(`${k}: `) + "\n" + clc.yellow(`${denomString_}`))
    } else {
      console.log(clc.blue(`${k}-minBet(${gameMinBet_.minBet}): `) + "\n" + clc.yellow(`${denomString_}`))

      const keyDefaultMinBetIdCurrency_ = `${gameMinBet_.minBet}-${v.currency}`
      const excelDenomList_ = minBetToExcelDenomListMap.get(keyDefaultMinBetIdCurrency_)
      const denomList_ = convertExcelToDenomList(excelDenomList_)
      const denomConvertString_ = convertListToDenomConvertString(denomList_)
      console.log("\n" + clc.red(`${keyDefaultMinBetIdCurrency_}-denomList(${denomConvertString_}): `))
    }
  })
}

module.exports = { output }
