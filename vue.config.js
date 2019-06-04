const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const production = process.env.NODE_ENV === 'production';
module.exports = {
  publicPath: '',
  css: {
    modules: true
    // loaderOptions: {
    //   // 给 less-loader 传递选项
    //   less: {
    //     // @/ 是 src/ 的别名
    //     // 所以这里假设你有 `src/variables.less` 这个文件
    //     data: `@import "@/variables.less";`
    //   }
    // }
  },
  chainWebpack: config => {
    config.optimization.splitChunks({
      cacheGroups: {
        common: {
          name: 'chunk-common',
          chunks: 'all',
          priority: 2,
          // 被引用次数
          minChunks: 2,
          enforce: true
        }
      }
    });
  },
  configureWebpack: config => {
    if (production) {
      config.optimization.minimizer = [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_console: true, //console
              drop_debugger: true,
              pure_funcs: ['console.log'] //移除console
            }
          }
        })
      ];
    } else {
      // 为开发环境修改配置...
    }
  },
  productionSourceMap: production ? false : true
};
