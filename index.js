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
      let walker  = walk.walk(CONFIG.rootPath, {
        followLinks: false
      })
      let files = []
      walker.on('file', function(root, stat, next) {
        if (CONFIG.excludeDir && Array.isArray(CONFIG.excludeDir)) {
          for (let i = 0; i < CONFIG.excludeDir.length; i++) {
            const exclude = CONFIG.excludeDir[i];
            if (root.indexOf(`${CONFIG.rootPath}/${exclude}`) > -1) {
              next();
              return
            }
          }
        }
        const result = root.replace(CONFIG.rootPath, '').slice(1);
        files.push({
          getPath: root + '/' + stat.name,
          putPath: `/${CONFIG.prefix}/${result.length > 0 ? result + '/' : ''}${stat.name}`
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
