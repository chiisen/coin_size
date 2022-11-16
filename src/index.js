const clc = require("cli-color")

const { initGameDenomBetGold } = require("./gameDenomBetGold")
const { initGameDenomBetGoldSetting } = require("./gameDenomBetGoldSetting")
const { initGameMinBet } = require("./gameMinBet")
const { initSingleMinBet } = require("./minBet")
const { initCurrencyExchangeRate } = require("./currencyExchangeRate")
const { initMaxDenom } = require("./maxDenom")

const { output } = require("./output")
const { coinSize } = require("./coinSize")
const { initCoinSizeConvert, coinSizeConvertSQL } = require("./coinSizeConvert")

initGameDenomBetGold()

//initGameDenomBetGoldSetting()

//initGameMinBet()

//initSingleMinBet()

//initCurrencyExchangeRate()

//initMaxDenom()

initCoinSizeConvert()

//output()

//coinSize()

coinSizeConvertSQL()

console.log(clc.red("coin_size 程式結束!"))
