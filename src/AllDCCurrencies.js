const { excel } = require("58-toolkit")
const { getExcel } = excel

import { hallNameMap } from "./hallName"

export const allDCCurrenciesMap = new Map()

export function initAllDCCurrencies(excelAllDCCurrenciesInputFileName) {
  const AllDCCurrencies_ = getExcel(excelAllDCCurrenciesInputFileName, false, "AllDCCurrencies")
  AllDCCurrencies_.forEach((row) => {
    const dc_ = row[0]
    const hallId_ = row[1]
    const currencies_ = row[3]

    if (dc_ != "DC" && dc_ != "NULL") {
      // @note 有找不到 Cid，結果DC為NULL的狀況，先略過
      const keyDC_ = `${dc_}`
      const allDCCurrenciesData_ = allDCCurrenciesMap.get(keyDC_)
      if (allDCCurrenciesData_) {
        console.log(`${dc_}-${hallId_} 重複了`)
      } else {
        const hallData_ = hallNameMap.get(hallId_)
        const payLoad_ = {
          dc: dc_,
          hallId: hallId_,
          currencies: currencies_,
          patch: hallData_.pathList,
        }
        allDCCurrenciesMap.set(keyDC_, payLoad_)
      }
    }
  })
}
