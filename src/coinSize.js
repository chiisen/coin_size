const clc = require("cli-color")

const { data, excel, convert } = require("58-toolkit")
const { denomIndexToDenomString, denomStringToDenomRatio } = data
const { writeMultiplePagesExcel } = excel
const { convertExcelToDenomList, convertListToDenomConvertString } = convert

const { minBetToExcelDenomListMap } = require("./minBet")
const { currencyExchangeRateMap } = require("./currencyExchangeRate")
const { maxDenomMap } = require("./maxDenom")

const minBetList = [1, 3, 5, 9, 10, 15, 20, 25, 30, 40, 50, 88]

const denomIndexList = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
]

const betLevelList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/**
 *
 */
function coinSize() {
  currencyExchangeRateMap.forEach((v, k) => {
    subCoinSize(k, v)
  })
}

/**
 *
 */
function subCoinSize(currency, cryDef) {
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
        const currencyExchangeRate = 1 / cryDef

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

        /**
         * 不合理的原因
         */
        let unreasonableReason_ = ""

        if (cny_ >= 1 && rate_ >= 1 && rate_ <= 200) {
          reasonableValue_ = true
        } else {
          if (cny_ < 1) {
            unreasonableReason_ += "CNY小於1,"
          }
          if (rate_ < 1) {
            unreasonableReason_ += "Rate小於1,"
          }
          if (rate_ > 200) {
            unreasonableReason_ += "Rate大於200,"
          }
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
          unreasonableReason: unreasonableReason_,
          cryDef: cryDef,
        })

        id_ += 1
      })
    })
  })

  outputExcel(allCoinSize_, currency)
}

/**
 * 寫入 Excel
 * @param {*} allCoinSize
 */
function outputExcel(allCoinSize, currency) {
  /**
   * 所有 minBet 在 1 到 88 頁籤上的初始化
   */
  const excelMinBetDataMap = new Map([
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

  const sheetName = `all`

  let buff = []

  /**
   * 所有的 minBet 在一頁籤上
   */
  const excelAllMinBetData = []

  /**
   * 寫入標題
   */
  const title_ = [
    "id",
    "minBet",
    "denomIndex",
    "denomString",
    "denomRatio",
    "betLevel",
    "betGold",
    "CNY",
    "Rate",
    "reasonableValue",
    "unreasonableReason",
    "minBetDenom比率(0.6~200)",
  ]

  //寫入標題到所有的 minBet 在一頁籤上
  excelAllMinBetData.push(title_)

  //寫入標題到所有 minBet 在 1 到 88 頁籤上
  excelMinBetDataMap.forEach((v, k) => {
    v.push(title_)
  })

  /**
   * 如果為 false 將不會存檔
   */
  let isSuccess_ = true

  /**
   * 是否開啟顯示錯誤錯誤 log
   */
  const isLogErrorMsg_ = false

  /**
   * 是否排除不合理值
   */
  const excludeUnreasonable_ = false

  /**
   * 是否開啟最大範圍的 denom，會有超出範圍的問題
   */
  const isIncludesAll_ = false

  allCoinSize.forEach((x) => {
    excelAllMinBetData.push([
      x.id,
      x.minBet,
      x.denomIndex,
      x.denomString,
      x.denomRatio,
      x.betLevel,
      x.betGold,
      x.CNY,
      x.Rate,
      x.reasonableValue,
      x.unreasonableReason,
    ])

    excelMinBetDataMap.forEach((v, k) => {
      if (isSuccess_) {
        if (k === x.minBet) {
          let isExcludeUnreasonable_ = false
          if (excludeUnreasonable_) {
            //是否排除不合理值
            if (!x.reasonableValue) {
              isExcludeUnreasonable_ = true
            }
          }

          if (!isExcludeUnreasonable_) {
            const keyMinBetIdCurrency_ = `${x.minBet}-${currency}`
            const excelDenomList_ = minBetToExcelDenomListMap.get(keyMinBetIdCurrency_)
            const minBetDenomList_ = convertExcelToDenomList(excelDenomList_)
            const maxDenomList_ = maxDenomMap.get(currency)

            let includesDenomList_
            if (isIncludesAll_) {
              includesDenomList_ = maxDenomList_
              console.log(clc.yellow(`目前使用最大的minBet`))
            } else {
              includesDenomList_ = minBetDenomList_
              console.log(clc.yellow(`目前使用對應的minBet`))
            }

            if (!includesDenomList_) {
              console.log(clc.red(`${keyMinBetIdCurrency_} not found`))

              isSuccess_ = false
            } else {
              //檢查 denom 是否有包含在內
              includesCheck(includesDenomList_, currency, x, v, isLogErrorMsg_)
            }
          }
        }
      }
    })
  })

  if (isSuccess_) {
    let oneSheetData = { name: `.${sheetName}`, data: [...excelAllMinBetData] }

    buff.push(oneSheetData)

    excelMinBetDataMap.forEach((v, k) => {
      if (v.length < 10) {
        console.error(`${currency}-${k} 不到 10 組可以選擇`)
      }
      let oneSheetData = { name: `.M${k}-C${v.length}`, data: [...v] }

      buff.push(oneSheetData)
    })

    writeMultiplePagesExcel(`./output/coin_size_${currency}.xlsx`, buff)
  }
}

/**
 * 檢查 denom 是否有包含在內
 *
 * @param {*} includesDenomList_
 * @param {*} x
 */
function includesCheck(includesDenomList_, currency, x, v, isLogErrorMsg) {
  let msg_ = ``

  const isIncludes_ = includesDenomList_.includes(x.denomIndex)
  if (!isIncludes_) {
    const denomString_ = convertListToDenomConvertString(includesDenomList_)

    msg_ =
      clc.yellow(`currency: ${currency} minBet: ${x.minBet} `) +
      "\n" +
      clc.red(`denomString: ${x.denomString}`) +
      "\n" +
      clc.blue(`denomIndex: ${x.denomIndex} denomRatio: ${x.denomRatio} `) +
      clc.green(`not includes [minBet denom: ${denomString_}]`)

    if (isLogErrorMsg) {
      console.log(msg_)
    } else {
      //msg_ = `currency: ${currency} minBet: ${x.minBet} denomString: ${x.denomString} denomIndex: ${x.denomIndex} denomRatio: ${x.denomRatio} not includes [minBet denom: ${denomString_}]`
      //@note 計算 minBet 是否在合理範圍
      const minBetDenomRatio_ = (x.minBet * x.betLevel * x.denomRatio) / x.cryDef
      //msg_ = `(minBet: ${x.minBet} ✖ betLevel: ${x.betLevel} ✖ denom: ${x.denomString}) ➗ ${x.cryDef} = ${minBetDenomRatio_.toFixed(6)} `
      msg_ = `${minBetDenomRatio_.toFixed(2)} `
    }
  } else {
    //不範圍內的 denom 處理
  }

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
    x.reasonableValue,
    x.unreasonableReason,
    msg_,
  ])
}

module.exports = { coinSize }
