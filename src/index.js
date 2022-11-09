const clc = require("cli-color")

const { initGameDenomBetGold } = require("./gameDenomBetGold")
const { initGameDenomBetGoldSetting } = require("./gameDenomBetGoldSetting")
const { output } = require("./output")

//@note 測試本地包
const { run } = require("58-toolkit")
run()

initGameDenomBetGold()

initGameDenomBetGoldSetting()

output()

console.log(clc.red("程式結束!"))
