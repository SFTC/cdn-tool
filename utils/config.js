const fs = require('fs')

const config = () => {
  return new Promise((resolve, reject) => {
    try {
      let file = fs.readFileSync('./deploy-config.json', 'utf8')
      resolve(JSON.parse(file))
    } catch (e) {
      reject(new Error('解析配置文件出错'))
    }
  })
}

module.exports.config = config
