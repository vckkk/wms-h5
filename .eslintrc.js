module.exports = {
  extends: require.resolve('@umijs/lint'),
  // 根据个人习惯自定义rule
  rules: {
    'no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: true }], // 允许函数参数、解构未使用
    eqeqeq: 'off',
    'no-console': 'off',
    'no-console': 'warn',
    'prefer-const': 'warn',
    'react-hooks/exhaustive-deps': 'error', // react-hooks 依赖检查
    'no-empty': 'off', // catch{} 允许为空
    '@typescript-eslint/no-shadow': ['off'], // 当前作用域变量名不能与父级作用域变量同名
    '@typescript-eslint/no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }], // 允许函数参数、解构未使用
    'react/self-closing-comp': 'off',
    'spaced-comment': 'off', // 关闭注释中的空格规则校验
    'no-param-reassign': 'off', // 禁用
    '@typescript-eslint/consistent-type-imports': 'off',
    'react-hooks/exhaustive-deps': 'off', // 关闭 exhaustive-deps 规则
    '@typescript-eslint/no-unused-expressions': 'off',
    'react-hooks/rules-of-hooks': 'off',
    '@typescript-eslint/no-empty-interface': 'off', // 禁用防止声明空的接口
    '@typescript-eslint/consistent-indexed-object-style': 'off', // 强制执行索引签名对象类型的一致性风格
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/ban-types': 'off', //关闭禁止使用 Object, Function, ``, 或 object 这些类型
    'react/no-children-prop': 'off',
    'react/jsx-key': 'off',
    'react/no-array-index-key': 'off', // 关闭数组下标不能作为key，日常开发时尽量避免
  },
};
