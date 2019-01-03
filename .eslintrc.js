module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es6": true,
        "jest/globals": true
    },
    globals: {},
    parser: 'babel-eslint',
    "extends": ["eslint:recommended"],
    "plugins": ["jest","prettier"],
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module"
    },
    "rules": {
        'no-unused-vars': 1,
        'no-console': 1,
        "prettier/prettier": "error"
    }
}
