const off = "off";

module.exports = {
	root: true,
	extends: [
		"plugin:@typescript-eslint/recommended",
		"airbnb-typescript/base",
		"prettier",
	],
	parserOptions: {
		project: "tsconfig.eslint.json",
		tsconfigRootDir: __dirname,
	},
	env: {
		browser: true,
		jest: true,
	},
	rules: {
		"import/prefer-default-export": off,
		"no-plusplus": off,
	},
};
