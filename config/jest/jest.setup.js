const { getTestRule } = require('jest-preset-stylelint')
const failOnConsole = require('jest-fail-on-console')

global.testRule = getTestRule({ plugins: ['./lib/rules'] })

failOnConsole({ shouldFailOnWarn: true })
