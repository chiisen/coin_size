const clc = require("cli-color")
const { file } = require("58-toolkit")
const { emptyDir } = file

const { initGameDenomBetGold } = require("./gameDenomBetGold")
const { checkGameDenomBetGold } = require("./checkGameDenomBetGold")
const { initGameDenomBetGoldSetting } = require("./gameDenomBetGoldSetting")
const { initGameMinBet } = require("./gameMinBet")
const { initSingleMinBet } = require("./minBet")
const { initCurrencyExchangeRate } = require("./currencyExchangeRate")
const { initMaxDenom } = require("./maxDenom")
const { coinSizeConvertSQL } = require("./coinSizeConvert")

const { output } = require("./output")
const { coinSize } = require("./coinSize")
const { initCurrency } = require("./currency")

//刪除所有檔案
emptyDir(`./output`)

initCurrency()

initGameDenomBetGold()

//initGameDenomBetGoldSetting()

initGameMinBet()

//initSingleMinBet()

initCurrencyExchangeRate()

//initMaxDenom()

//output()

//coinSize()

checkGameDenomBetGold()

coinSizeConvertSQL()

console.log(clc.red("coin_size 程式結束!"))
