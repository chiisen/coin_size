const clc = require("cli-color")

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

initCurrency()

initGameDenomBetGold()

//initGameDenomBetGoldSetting()

//initGameMinBet()

//initSingleMinBet()

//initCurrencyExchangeRate()

//initMaxDenom()

//output()

//coinSize()

coinSizeConvertSQL()

checkGameDenomBetGold()

console.log(clc.red("coin_size 程式結束!"))
