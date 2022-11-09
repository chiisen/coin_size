const clc = require("cli-color")

const { data, excel } = require("58-toolkit")
const { denomIndexToDenomString, denomStringToDenomRatio } = data
const { writeMultiplePagesExcel } = excel

const minBetList = [1, 3, 5, 9, 10, 15, 20, 25, 30, 40, 50, 88]

const denomIndexList = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
]

const betLevelList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/**
 *
 */
function coinSize(excelOutputFileName) {
  let buff = []

  const coinSize_ = []

  let id_ = 1

  const sheetName = `coin_size`

  const excelData = []

  excelData.push(["minBet", "denomIndex", "denomString", "denomRatio", "betLevel", "betGold"])

  denomIndexList.forEach((denomIndex_) => {
    betLevelList.forEach((betLevel_) => {
      minBetList.forEach((minBet_) => {
        const denomString_ = denomIndexToDenomString(denomIndex_)
        const denomRatio_ = denomStringToDenomRatio(denomString_)
        const betGold_ = minBet_ * denomRatio_ * betLevel_

        coinSize_.push({
          id: id_,
          minBet: minBet_,
          denomIndex: denomIndex_,
          denomString: denomString_,
          denomRatio: denomRatio_,
          betLevel: betLevel_,
          betGold: betGold_,
        })

        excelData.push([minBet_, denomIndex_, denomString_, denomRatio_, betLevel_, betGold_])
      })
    })
  })

  let oneSheetData = { name: `.${sheetName}`, data: [...excelData] }

  buff.push(oneSheetData)

  writeMultiplePagesExcel(excelOutputFileName, buff)
}

module.exports = { coinSize }
