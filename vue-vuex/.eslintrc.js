/*
 * @Author: 落秋
 * @Date: 2019-12-11 00:37:02
 * @LastEditTime: 2019-12-13 23:00:29
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 0,
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
