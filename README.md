# cdn 小工具

cdn小工具用于项目中快速上传cdn服务的小工具，暂时只支持cos

### 安装

```
npm i cdn-tool -g
```

### 使用

在需要上传的文件中，新建`deploy-config.json`文件

方法1(没有cos密钥):

```
{
  "prefix": "fe-knight",  // 上传到cdn中前缀文件目录
  "excludeDir": "exclude-dir", // 上传目录中不需要上传的文件夹
  "rootPath": "./dist", // 需要上传的文件夹必传
  "requestUrl": "请求cos授权地址(需要自己搭建)"
}
```

方法2(有cos密钥):

```
{
  "prefix": "fe-knight",  // 上传到cdn中前缀文件目录
  "excludeDir": "exclude-dir", // 上传目录中不需要上传的文件夹
  "rootPath": "./dist", // 需要上传的文件夹必传
  "region": "***",
  "bucket": "***",
  "appId": "***",
  "secretId": "***",
  "secretKey": "***"
}
```

`***`的配置详情请看[cos官网](https://cloud.tencent.com/product/cos)购买之后会有(或者找op要)

终端执行`cdn upload`上传
