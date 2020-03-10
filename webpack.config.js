const path = require('path');

const { NODE_ENV = 'development' } = process.env;

module.exports = {
	entry: path.join(__dirname + '/cloud-fns/src/index.ts'),
	mode: NODE_ENV,
	target: 'node',
	output: {
		path: path.join(__dirname, '/dist'),
		filename: 'bundle.js',
		libraryTarget: 'commonjs'
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{ test: /\.ts$/, use: 'ts-loader'},
		],
	},
};