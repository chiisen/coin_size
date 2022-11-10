const clc = require("cli-color")

const { excel } = require("58-toolkit")
const { getExcel } = excel

const currencyExchangeRateMap = new Map()

/**
 * 取得所有匯率
 */
function initCurrencyExchangeRate() {
  const currencyExchangeRateSheet_ = getExcel("./input/currency_exchange_rate.xlsx", false, "currency_exchange_rate")

  currencyExchangeRateSheet_.forEach((row_) => {
    const exCurrency_ = row_[0]
    const cryDef_ = row_[1]

    if (exCurrency_ != "ExCurrency") {
      currencyExchangeRateMap.set(exCurrency_, cryDef_)
    }
  })
}

module.exports = { initCurrencyExchangeRate, currencyExchangeRateMap }
