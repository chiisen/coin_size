const clc = require("cli-color")

const { betGoldMap } = require("./gameDenomBetGold")
const { betGoldSettingMap } = require("./gameDenomBetGoldSetting")

//@note 測試本地包
const { data } = require("58-toolkit")
const { denomIndexToDenomString } = data

/**
 *
 */
function output() {
  betGoldSettingMap.forEach((v, k) => {
    const betGoldIdList_ = v.premadeBetGoldIdList.split(",")
    let denomString_ = ""
    betGoldIdList_.forEach((id_) => {
      const nId_ = Number(id_)
      const val_ = betGoldMap.get(nId_)
      const denom_ = denomIndexToDenomString(val_.denomId)
      denomString_ += `${denom_}(${val_.denomId})[${val_.betGold.toString()}],` + "\n"
    })
    console.log(clc.blue(`${k}: `) + "\n" + clc.yellow(`${denomString_}`))
  })
}

module.exports = { output }
