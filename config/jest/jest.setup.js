const { getTestRule } = require('jest-preset-stylelint')
const failOnConsole = require('jest-fail-on-console')

global.testRule = getTestRule({ plugins: ['./'] })

failOnConsole({ shouldFailOnWarn: true })
