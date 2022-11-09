const clc = require("cli-color")

const { initGameDenomBetGold } = require("./gameDenomBetGold")
const { initGameDenomBetGoldSetting } = require("./gameDenomBetGoldSetting")
const { output } = require("./output")

initGameDenomBetGold()

initGameDenomBetGoldSetting()

output()

console.log(clc.red("coin_size 程式結束!"))
