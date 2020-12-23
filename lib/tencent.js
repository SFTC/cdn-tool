const COS = require('cos-nodejs-sdk-v5')
const fs = require('fs')
const request = require('request')

const log = require('../utils/log')
const { config } = require('../utils/config')

module.exports.upload = ({
  putPath,
  getPath,
  rootPath
}) => {
  return new Promise(resolve => {
    config().then(async (env) => {
      let client
      if (env.requestUrl) {
        client = new COS({
          getAuthorization: function (options, callback) {
            // 异步获取临时密钥
            request({
              url: env.requestUrl,
              data: {
                // 可从 options 取需要的参数
              }
            }, (err, response, body) => {
              let credentials, data
              try {
                const responseData = JSON.parse(body) || {};
                data = responseData.data;
                credentials = data.credentials;
              } catch(e) {
                console.log(e);
              }
              if (!data || !credentials) return console.error('credentials invalid');
              callback({
                TmpSecretId: credentials.tmpSecretId,        // 临时密钥的 tmpSecretId
                TmpSecretKey: credentials.tmpSecretKey,      // 临时密钥的 tmpSecretKey
                XCosSecurityToken: credentials.sessionToken, // 临时密钥的 sessionToken
                ExpiredTime: data.expiredTime,               // 临时密钥失效时间戳，是申请临时密钥时，时间戳加 durationSeconds
              });
            });
          }
        });
      } else {
        client = new COS({
          AppId: env.appid,
          SecretId: env.secretId,
          SecretKey: env.secretKey
        })
      }
      client.putObject({
        Bucket: env.bucket,
        Region: env.region,
        Key: `${rootPath.replace(env.rootPath, '')}/${env.prefix}/${putPath}`,
        Body: fs.createReadStream(getPath),
      }, (err, data) => {
        log({
          status: (data && data.statusCode) === 200,
          getPath,
          putPath: `${rootPath.replace(env.rootPath, '')}/${env.prefix}/${putPath}`,
          resultPath: data && data.Location
        })
        resolve();
      })
    })
  })
}
