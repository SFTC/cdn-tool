const chalk = require('chalk')

module.exports = ({
  status,
  getPath,
  putPath,
  resultPath
}) => {
  status = status ? ` - ${chalk.green(('[成功]').padEnd(16))}` : ` - ${chalk.red('[失败]'.padEnd(16))}`

  if (process.stdout.columns > 160) {
    console.log(`${status}${getPath}${chalk.yellow(' -> ')}${putPath}`)
  } else {
    console.log(`${status}` + `${chalk.cyan(resultPath)}`)
  }
}
