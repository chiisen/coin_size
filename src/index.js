const clc = require("cli-color")

const { initGameDenomBetGold } = require("./gameDenomBetGold")
const { initGameDenomBetGoldSetting } = require("./gameDenomBetGoldSetting")
const { initGameMinBet } = require("./gameMinBet")
const { initSingleMinBet } = require("./minBet")

const { output } = require("./output")
const { coinSize } = require("./coinSize")

const excelOutputFileName = "./output/coin_size.xlsx"

//initGameDenomBetGold()

//initGameDenomBetGoldSetting()

//initGameMinBet()

//initSingleMinBet()

//output()

coinSize(excelOutputFileName)

console.log(clc.red("coin_size 程式結束!"))
