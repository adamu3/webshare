const path = require('path');

module.exports = {
	entry: path.resolve(__dirname, 'src/index.js'),
	output: {
		filename:'index_bundle.js',
		path: path.resolve(__dirname, "build"),
		library:"Transit",
		libraryTarget: "umd",		
	},
	resolve: {
	  modules: [
	    path.join(__dirname, "src/js"),
	    "node_modules"
	  ]
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: "babel-loader",
			},
		],
	},
	mode: "development",
}