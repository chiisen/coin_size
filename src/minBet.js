const { excel, convert } = require("58-toolkit")
const { getExcel } = excel
const { convertExcelToDenomList, convertExcelToExcelDenomList } = convert

/**
 * key: minBet 與 currency 回傳 EXCEL 格式的 denom
 */
const minBetToExcelDenomListMap = new Map()

/**
 * key: minBetId 與 currency 回傳 denom 索引
 */
const minBetCurrencyToDefaultDenomIndexMap = new Map()

/**
 * key: minBetId 與 currency 回傳第幾個 denom
 */
const minBetCurrencyToDefaultDenomNthMap = new Map()

/**
 *
 */
function initSingleMinBet() {
  //讀取 gameMinBet.xlsx(遊戲的minBet) 與 minBet.xlsx(minBet 1~88)
  initAllMinBets("./input/minBet.xlsx")
}

/**
 *
 * @param excelMinBetInputFileName
 */
function initAllMinBets(excelMinBetInputFileName) {
  const minBet1_ = getExcel(excelMinBetInputFileName, false, "minBet_1")
  initMinBet(1, minBet1_)
  const minBet3_ = getExcel(excelMinBetInputFileName, false, "minBet_3")
  initMinBet(3, minBet3_)
  const minBet5_ = getExcel(excelMinBetInputFileName, false, "minBet_5")
  initMinBet(5, minBet5_)
  const minBet9_ = getExcel(excelMinBetInputFileName, false, "minBet_9")
  initMinBet(9, minBet9_)
  const minBet10_ = getExcel(excelMinBetInputFileName, false, "minBet_10")
  initMinBet(10, minBet10_)
  const minBet15_ = getExcel(excelMinBetInputFileName, false, "minBet_15")
  initMinBet(15, minBet15_)
  const minBet20_ = getExcel(excelMinBetInputFileName, false, "minBet_20")
  initMinBet(20, minBet20_)
  const minBet25_ = getExcel(excelMinBetInputFileName, false, "minBet_25")
  initMinBet(25, minBet25_)
  const minBet30_ = getExcel(excelMinBetInputFileName, false, "minBet_30")
  initMinBet(30, minBet30_)
  const minBet40_ = getExcel(excelMinBetInputFileName, false, "minBet_40")
  initMinBet(40, minBet40_)
  const minBet50_ = getExcel(excelMinBetInputFileName, false, "minBet_50")
  initMinBet(50, minBet50_)
  const minBet88_ = getExcel(excelMinBetInputFileName, false, "minBet_88")
  initMinBet(88, minBet88_)
}

/**
 *
 * @param minBetId
 * @param minBetSheet
 */
function initMinBet(minBetId, minBetSheet) {
  minBetSheet.forEach((row) => {
    const currency = row[0]
    const cryDef = row[1]

    if (currency && cryDef != "不支援") {
      const excelDenomArray_ = [
        row[3], //29 1:100000
        row[4], //28 1:50000
        row[5],
        row[6],
        row[7],
        row[8],
        row[9],
        row[10],
        row[11],
        row[12],
        row[13],
        row[14],
        row[15],
        row[16],
        row[17],
        row[18],
        row[19],
        row[20],
        row[21],
        row[22],
        row[23],
        row[24],
        row[25],
        row[26],
        row[27],
        row[28],
        row[29],
        row[30], //2 50000:1
        row[31], //1 100000:1
      ]

      const defaultDenomNth_ = row[32] //第幾個denom
      const denomList_ = convertExcelToDenomList(excelDenomArray_)

      const keyDefaultMinBetIdCurrency_ = `${minBetId}-${currency}`
      if (defaultDenomNth_ === 0) {
        minBetCurrencyToDefaultDenomIndexMap.set(keyDefaultMinBetIdCurrency_, denomList_[0])
        minBetCurrencyToDefaultDenomNthMap.set(keyDefaultMinBetIdCurrency_, 1)
      } else {
        const defaultDenomNthIndex_ = defaultDenomNth_ - 1
        minBetCurrencyToDefaultDenomIndexMap.set(keyDefaultMinBetIdCurrency_, denomList_[defaultDenomNthIndex_])
        minBetCurrencyToDefaultDenomNthMap.set(keyDefaultMinBetIdCurrency_, defaultDenomNth_)
      }

      const excelDenomList_ = convertExcelToExcelDenomList(excelDenomArray_)

      const keyMinBetIdCurrency_ = `${minBetId}-${currency}`
      if (minBetToExcelDenomListMap.get(keyMinBetIdCurrency_)) {
        console.log(`keyMinBetIdCurrency_: ${keyMinBetIdCurrency_}-重複了`)
      }
      minBetToExcelDenomListMap.set(keyMinBetIdCurrency_, excelDenomList_)
    }
  })
}

module.exports = {
  initSingleMinBet,
  minBetToExcelDenomListMap,
  minBetCurrencyToDefaultDenomIndexMap,
  minBetCurrencyToDefaultDenomNthMap,
}
