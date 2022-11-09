const clc = require("cli-color")

const { betGoldMap } = require("./gameDenomBetGold")
const { betGoldSettingMap } = require("./gameDenomBetGoldSetting")

/**
 *
 */
function output() {
  betGoldSettingMap.forEach((v, k) => {
    const betGoldIdList_ = v.premadeBetGoldIdList.split(",")
    let betGoldListString_ = ""
    betGoldIdList_.forEach((id_) => {
      const nId_ = Number(id_)
      const val_ = betGoldMap.get(nId_)
      betGoldListString_ += val_.betGold.toString() + ","
    })
    console.log(clc.blue(`${k}: `) + clc.yellow(`${betGoldListString_}`))
  })
}

module.exports = { output }
