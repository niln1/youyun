module.exports = {
    entry: {
        signup: "./core/react/signup/index.jsx",
        parentHome: "./core/react/parentHome/main.jsx"
    },
    output: {
        path: "./core/staticjs/",
        filename: "[name]Bundle.js",
        chunkFilename: "[id]Bundle.js"
        devtool: "eval"
    }
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }
};