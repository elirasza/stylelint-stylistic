const { createPlugin } = require('stylelint')
const valueParser = require('postcss-value-parser')

const declarationValueIndex = require('stylelint/lib/utils/declarationValueIndex')
const getDeclarationValue = require('stylelint/lib/utils/getDeclarationValue')
const report = require('stylelint/lib/utils/report')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const setDeclarationValue = require('stylelint/lib/utils/setDeclarationValue')
const validateOptions = require('stylelint/lib/utils/validateOptions')

const ruleName = 'stylistic/color-hex-case'

const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/color-hex-case',
  fixable: true,
}

const HEX = /^#[0-9A-Za-z]+/
const IGNORED_FUNCTIONS = new Set(['url'])

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => (root, result) => {
  const validOptions = validateOptions(result, ruleName, {
    actual: primary,
    possible: ['lower', 'upper'],
  })

  if (!validOptions) {
    return
  }

  root.walkDecls((decl) => {
    const parsedValue = valueParser(getDeclarationValue(decl))
    let needsFix = false

    parsedValue.walk((node) => {
      const { value } = node

      if (isIgnoredFunction(node)) return false

      if (!isHexColor(node)) return

      const expected = primary === 'lower' ? value.toLowerCase() : value.toUpperCase()

      if (value === expected) return

      if (context.fix) {
        node.value = expected
        needsFix = true

        return
      }

      report({
        message: messages.expected(value, expected),
        node: decl,
        index: declarationValueIndex(decl) + node.sourceIndex,
        result,
        ruleName,
      })
    })

    if (needsFix) {
      setDeclarationValue(decl, parsedValue.toString())
    }
  })
}

/**
 * @param {import('postcss-value-parser').Node} node
 */
function isIgnoredFunction({ type, value }) {
  return type === 'function' && IGNORED_FUNCTIONS.has(value.toLowerCase())
}

/**
 * @param {import('postcss-value-parser').Node} node
 */
function isHexColor({ type, value }) {
  return type === 'word' && HEX.test(value)
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
module.exports = { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
