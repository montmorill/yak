import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'ts/no-namespace': 'off',
    'ts/no-redeclare': 'off',
    'unicorn/error-message': 'off',
    'style/arrow-parens': ['warn', 'as-needed'],
  },
})
