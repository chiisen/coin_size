const fs = require("fs")

/**
 * 寫入 alter.sql
 *
 * @param {*} subPath
 * @param {*} insertText
 */
function writeAlter(subPath, insertText, fileName) {
  let alterName_ = "alter.sql"
  if (fileName) {
    alterName_ = fileName
  }
  fs.writeFileSync(`${subPath}/${alterName_}`, insertText, "utf8")
}

/**
 * 插入文字到 alter.sql
 *
 * @param {*} subPath
 * @param {*} insertText
 */
function appendAlter(subPath, insertText, fileName) {
  fs.appendFileSync(`${subPath}/${fileName}`, insertText, "utf8")
}

module.exports = { writeAlter, appendAlter }
