const clc = require("cli-color")

const { initGameDenomBetGold } = require("./gameDenomBetGold")
const { initGameDenomBetGoldSetting } = require("./gameDenomBetGoldSetting")
const { initGameMinBet } = require("./gameMinBet")
const { initSingleMinBet } = require("./minBet")
const { initCurrencyExchangeRate } = require("./currencyExchangeRate")

const { output } = require("./output")
const { coinSize } = require("./coinSize")

//initGameDenomBetGold()

//initGameDenomBetGoldSetting()

//initGameMinBet()

initSingleMinBet()

initCurrencyExchangeRate()

//output()

coinSize()

console.log(clc.red("coin_size 程式結束!"))
