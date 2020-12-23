const walk = require('walk')
const ora = require('ora')
const tencent = require('./lib/tencent')
const {
  config
} = require('./utils/config')

module.exports = () => {
  config().then(CONFIG => {
    const upload = async (files) => {
      for (let file of files) {
        const {
          putPath,
          getPath,
          rootPath
        } = file
        await tencent.upload({
          putPath,
          getPath,
          rootPath
        })
      }
    }
    (() => {
      let walker  = walk.walk('./dist', {
        followLinks: false
      })
      let files = []
      walker.on('file', function(root, stat, next) {
        if (CONFIG.excludeDir && root.indexOf(`${CONFIG.rootPath}/${CONFIG.excludeDir}`) > -1) {
          next();
          return;
        }
        files.push({
          getPath: root + '/' + stat.name,
          putPath: stat.name,
          rootPath: root
        });
        next();
      });
      const spinner = ora('处理中..').start()
      walker.on('end', function() {
        spinner.stop();
        upload(files);
      });
    })();
  })
}
