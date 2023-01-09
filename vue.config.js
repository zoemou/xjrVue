// 基础路径 注意发布之前要先修改这里

let baseUrl = "/";
const webpack = require('webpack');

const BASE_URL = process.env.NODE_ENV == "production" ? "/" : "/";
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require("path");
const timeStamp = new Date().getTime();

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: BASE_URL, // 根据你的实际情况更改这里
  devServer: {
    overlay: false,
    port: 7777 // 端口
    // proxy : 'http://localhost:5556'
    // proxy: {
    //   '/api': {
    //      target: 'http://localhost:5556', // 代理接口地址
    //      secure: false,  // 如果是https接口，需要配置这个参数
    //      changeOrigin: true, // 是否跨域
    //      pathRewrite: {
    //        '^/api': ''   //需要rewrite的, 这里理解成以'/api'开头的接口地址，把/api代替target中的地址
    //     }
    //   }
    // }
  },
  css: {
    sourceMap: true, // 开启 CSS source maps
    // 打包放开下面的注释
    // extract: {
    //   filename: `[name].${timeStamp}.css`,
    //   chunkFilename: `[name].${timeStamp}.css`
    // }
  },
  lintOnSave: false,
 
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks:5,
        minChunkSize:100
      })
    ],
    // 打包放开下面的注释
    // output: {
    //   filename: `[name].${timeStamp}.js`,
    //   chunkFilename: `[name].${timeStamp}.js`
    // },
    externals: {
      vue: "Vue",
      "vue-router": "VueRouter",
      "element-ui": "ELEMENT"
    },
    resolve: {
      alias: {
        // 配置组件引用路径
        "@xjr": "@/components/xjr"
      }
    },
    optimization: {
      splitChunks: {
        chunks: "async", // 仅提取按需载入的module
        minSize: 400000, // 提取出的新chunk在两次压缩(打包压缩和服务器压缩)之前要大于400kb
        maxSize: 0, // 提取出的新chunk在两次压缩之前要小于多少kb，默认为0，即不做限制
        minChunks: 1, // 被提取的chunk最少需要被多少chunks共同引入
        maxAsyncRequests: 5, // 最大按需载入chunks提取数
        maxInitialRequests: 3, // 最大初始同步chunks提取数
        automaticNameDelimiter: "~", // 默认的命名规则（使用~进行连接）
        name: true,
        cacheGroups: {
          // 缓存组配置，默认有vendors和default
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    }
  },
  // configureWebpack: config => {
  //     if (process.env.NODE_ENV === 'production') {
  //         return {
  //             plugins: [
  //                 new BundleAnalyzerPlugin()
  //             ]
  //         }
  //     }
  // },
  chainWebpack: config => {
    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();
    //忽略的打包文件
    config.externals({
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios",
      "element-ui": "ELEMENT"
    });
    const entry = config.entry("app");
    entry.add("babel-polyfill").end();
    entry.add("classlist-polyfill").end();
    entry.add("@/mock").end();
  }
};
