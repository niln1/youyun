module.exports = {
    entry: "./core/react/signup/index.jsx",
    output: {
        path: "./core/staticjs/",
        filename: "signupBundle.js",
        devtool: "eval"
    },
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