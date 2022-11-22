const { excel } = require("58-toolkit")
const { getExcel } = excel

const excelInputCurrencyFileName = `./input/currency.xlsx`
const currencyList = []

function initCurrency() {
  const currencySheet_ = getExcel(excelInputCurrencyFileName, false, "Currency")
  currencySheet_.forEach((row_) => {
    const currency_ = row_[0]

    if (currency_ != "Currency") {
      currencyList.push(currency_)
    }
  })
}

module.exports = {
  initCurrency,
  currencyList,
}
