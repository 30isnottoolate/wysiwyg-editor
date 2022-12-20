const {merge} = require("webpack-merge");
const webpackConfig = require("./webpack.config");

module.exports = merge(webpackConfig, {
    mode: "development",
    entry: "./src/index.tsx",

    devServer: {
        port: "3000",
        static: "./public",
        open: true,
        hot: true,
        liveReload: true
    },
});
