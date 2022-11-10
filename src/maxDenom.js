const clc = require("cli-color")

const { excel, convert } = require("58-toolkit")
const { getExcel } = excel
const { convertExcelToDenomList } = convert

const maxDenomMap = new Map()

/**
 * 取得所有匯率
 */
function initMaxDenom() {
  const maxDenomSheet_ = getExcel("./input/maxDenom.xlsx", false, "maxDenom")

  maxDenomSheet_.forEach((row_) => {
    const currency_ = row_[0]

    if (currency_ != "Currency") {
      const excelData_ = [
        row_[1],
        row_[2],
        row_[3],
        row_[4],
        row_[5],
        row_[6],
        row_[7],
        row_[8],
        row_[9],
        row_[10],
        row_[11],
        row_[12],
        row_[13],
        row_[14],
        row_[15],
        row_[16],
        row_[17],
        row_[18],
        row_[19],
        row_[20],
        row_[21],
        row_[22],
        row_[23],
        row_[24],
        row_[25],
        row_[26],
        row_[27],
        row_[28],
        row_[29],
      ]

      const denomList_ = convertExcelToDenomList(excelData_)

      maxDenomMap.set(currency_, denomList_)
    }
  })
}

module.exports = { initMaxDenom, maxDenomMap }
