const clc = require("cli-color")

const { data, excel, convert } = require("58-toolkit")
const { denomIndexToDenomString, denomStringToDenomRatio } = data
const { writeMultiplePagesExcel } = excel
const { convertExcelToDenomConvertString } = convert

const { minBetToExcelDenomListMap } = require("./minBet")

const minBetList = [1, 3, 5, 9, 10, 15, 20, 25, 30, 40, 50, 88]

const denomIndexList = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
]

const betLevelList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/**
 *
 */
function coinSize(excelOutputFileName) {
  const allCoinSize_ = []

  let id_ = 1

  denomIndexList.forEach((denomIndex_) => {
    betLevelList.forEach((betLevel_) => {
      minBetList.forEach((minBet_) => {
        const denomString_ = denomIndexToDenomString(denomIndex_)
        const denomRatio_ = denomStringToDenomRatio(denomString_)

        /**
         * @note 0.001743 為後台KBB匯率的倒數
         */
        const currencyExchangeRate = 0.001743

        /**
         * Debby 叫 betGold_ 為 coin size
         */
        const betGold_ = minBet_ * denomRatio_ * betLevel_

        /**
         * CNY 要大於1(符合成本)
         */
        const cny_ = betGold_ * currencyExchangeRate

        /**
         * Rate 大於1小於200
         */
        const rate_ = cny_ / minBet_

        /**
         * 是否在合理範圍
         */
        let reasonableValue_ = false

        if (cny_ >= 1 && rate_ >= 1 && rate_ <= 200) {
          reasonableValue_ = true
        }

        allCoinSize_.push({
          id: id_,
          minBet: minBet_,
          denomIndex: denomIndex_,
          denomString: denomString_,
          denomRatio: denomRatio_,
          betLevel: betLevel_,
          betGold: betGold_,
          CNY: cny_,
          Rate: rate_,
          reasonableValue: reasonableValue_,
        })

        id_ += 1
      })
    })
  })

  outputExcel(excelOutputFileName, allCoinSize_)
}

const excelDataMap = new Map([
  [1, []],
  [3, []],
  [5, []],
  [9, []],
  [10, []],
  [15, []],
  [20, []],
  [25, []],
  [30, []],
  [40, []],
  [50, []],
  [88, []],
])

/**
 * 寫入 Excel
 * @param {*} excelOutputFileName
 * @param {*} allCoinSize
 */
function outputExcel(excelOutputFileName, allCoinSize) {
  const sheetName = `coin_size`

  let buff = []

  const excelData = []

  excelData.push(["id", "minBet", "denomIndex", "denomString", "denomRatio", "betLevel", "betGold", "CNY", "Rate"])

  excelDataMap.forEach((v, k) => {
    v.push(["id", "minBet", "denomIndex", "denomString", "denomRatio", "betLevel", "betGold", "CNY", "Rate"])
  })

  allCoinSize.forEach((x) => {
    excelData.push([x.id, x.minBet, x.denomIndex, x.denomString, x.denomRatio, x.betLevel, x.betGold, x.CNY, x.Rate])

    excelDataMap.forEach((v, k) => {
      if (k === x.minBet && x.reasonableValue) {
        const currency_ = "KBB"
        const keyMinBetIdCurrency_ = `${x.minBet}-${currency_}`
        const excelDenomList_ = minBetToExcelDenomListMap.get(keyMinBetIdCurrency_)
        const denomString_ = convertExcelToDenomConvertString(excelDenomList_)

        let msg_ = ``
        const isOK_ = excelDenomList_.includes(x.denomIndex)
        if (!isOK_) {
          msg_ = `minBet: ${x.minBet} denomIndex: ${x.denomIndex} denomString: ${x.denomString} [${denomString_}]`
          console.error(msg_)
        } else {
          v.push([
            x.id,
            x.minBet,
            x.denomIndex,
            x.denomString,
            x.denomRatio,
            x.betLevel,
            x.betGold,
            x.CNY.toFixed(2),
            x.Rate.toFixed(2),
            msg_,
          ])
        }
      }
    })
  })

  let oneSheetData = { name: `.${sheetName}`, data: [...excelData] }

  buff.push(oneSheetData)

  excelDataMap.forEach((v, k) => {
    let oneSheetData = { name: `.${k}`, data: [...v] }

    buff.push(oneSheetData)
  })

  writeMultiplePagesExcel(excelOutputFileName, buff)
}

module.exports = { coinSize }
