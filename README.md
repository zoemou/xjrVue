<p align="center"><a href="https://avuejs.com" target="_blank" rel="noopener noreferrer"><img width="100" src="images/logo-bg.jpg" alt="Avue logo"></a></p>

## 介绍

avue-cli是一款基于avue和element-ui完全开源、免费的企业后端产品前端集成解决方案，采用最新的前端技术栈，已经准备好了大部分的项目准备工作，你可以快速进行二次开发

## 文档

[文档](https://www.kancloud.cn/smallwei/avue/579870)
[文档说明](https://avuejs.com/doc/plugins/avue-cli)

## 预览

[预览](https://cli.avuejs.com)

## 开发

```
# 克隆项目
git clone https://gitee.com/smallweigit/avue-cli.git

# 进入项目
cd avue-cli

# 安装依赖
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run serve

```
## 功能
- 登录/注销
  - 用户名登录
  - 验证码登录
  - 第三方登陆(QQ,微信)
  - 人脸识别登录
- 错误的日志记录
- 灵活的10+多款主题自由配置
- 路由权限、菜单权限、登录权限
- 本地化持久存储api
- 页面缓冲
- 面向全屏幕尺寸的响应式适配能力
- 对国际化的支持
- 自动刷新token等机制
- 全新的前端错误日志监控机制
- 前端路由动态服务端加载
- 无限极动态路由加载
- 模块的可拆卸化,达到开箱即用
- 更多。。。

## 问答

有关问题和支持，请使用[issues](https://gitee.com/smallweigit/avue-cli/issues)或加入QQ群.

## issues

打开问题之前，请务必提供详细的问题过程和截图，不符合准则的问题将会被拒绝.

## Changelog

每个版本的详细更改记录在[发行说明](https://gitee.com/smallweigit/avue-cli/releases).

## Page

### 登陆
<img src='http://avuejs.com/images/module1.jpg' width="700">

### 主页
<img src='http://avuejs.com/images/module2.jpg' width="700">

### 炫酷主题
<img src='http://avuejs.com/images/module3.jpg' width="700">

### 日志监控
<img src='http://avuejs.com/images/module4.jpg' width="700">

### 错误提示
<img src='http://avuejs.com/images/module5.jpg' width="700">

### 数据展示
<img src='http://avuejs.com/images/module6.jpg' width="700">

### 第三方网站
<img src='http://avuejs.com/images/module7.jpg' width="700">

### 全局搜索
<img src='http://avuejs.com/images/module9.jpg' width="700">

### 个人中心
<img src='http://avuejs.com/images/module10.jpg' width="700">

### 个人设置
<img src='http://avuejs.com/images/module11.jpg' width="700">

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017-present, Smallwei

### 官网体验项目已经更新为当前v2.0.2.6版本
#### 重点变更
- 项目路径变更为 
  - 生产环境 
    - app端 E:\framework-pro\app
    - 前端 E:\framework-pro\font
    - 后端 E:\framework-pro\server
    - bi E:\framework-pro\bi
    - 预览服务 E:\framework-pro\kkFileView-4.0.0
  - 测试环境 E:\framework-test
    - app端 未部署 使用生产环境同一个
    - 前端 E:\framework-test\font
    - 后端 E:\framework-test\server
    - bi E:\framework-test\bi
    - 预览服务 使用生产环境同一个
- 数据库变更
  - 生产环境 数据库名为： v2.0.2.6
  - 生产环境 数据库名为： v2.0.2.6_test
  - 以前的数据库不能使用 修改太多所以都是使用数据库工具重新生成的种子！
    - 以前的体验环境的工作流数据需要重做
    - bi的体验数据默认自带 不再需要重做
    - 新增很多erp数据表
- 部署方式
  - 前端部署 需要注意bi项目 地址的配置  打包前必须配置好 修改 框架前端 env.js
  - 后端项目部署方式未改变
  - 需要多部署2个项目 
    - bi项目 （数据前端vue项目）
    - 预览项目 （数据后端java项目 直接启动控制台   E:\framework-pro\kkFileView-4.0.0\kkFileView-4.0.0\bin 文件夹下 cmd 运行 startup.bat 即可
    默认端口 114.116.210.204:8012 可以直接访问这个地址测试  ）
- 官网有删除logo的版本 可以用于中介类客户 给他们的客户看 地址  114.116.210.204:6262
- 后端项目控制台警告 rabbitMQ 不用管 因为服务器没有装rabbitMQ而已  不影响使用
    