const { createPlugin } = require('stylelint')
const isCustomProperty = require('stylelint/lib/utils/isCustomProperty')
const isStandardSyntaxProperty = require('stylelint/lib/utils/isStandardSyntaxProperty')
const report = require('stylelint/lib/utils/report')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const optionsMatches = require('stylelint/lib/utils/optionsMatches')
const { isRegExp, isString } = require('stylelint/lib/utils/validateTypes')
const { isRule } = require('stylelint/lib/utils/typeGuards')

const ruleName = 'stylistic/property-case'

const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/property-case',
  fixable: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => (root, result) => {
  const validOptions = validateOptions(
    result,
    ruleName,
    {
      actual: primary,
      possible: ['lower', 'upper'],
    },
    {
      actual: secondaryOptions,
      possible: {
        ignoreSelectors: [isString, isRegExp],
      },
      optional: true,
    },
  )

  if (!validOptions) {
    return
  }

  root.walkDecls((decl) => {
    const { prop } = decl

    if (!isStandardSyntaxProperty(prop)) {
      return
    }

    if (isCustomProperty(prop)) {
      return
    }

    const { parent } = decl

    if (!parent) throw new Error('A parent node must be present')

    if (isRule(parent)) {
      const { selector } = parent

      if (selector && optionsMatches(secondaryOptions, 'ignoreSelectors', selector)) {
        return
      }
    }

    const expectedProp = primary === 'lower' ? prop.toLowerCase() : prop.toUpperCase()

    if (prop === expectedProp) {
      return
    }

    if (context.fix) {
      decl.prop = expectedProp

      return
    }

    report({
      message: messages.expected(prop, expectedProp),
      word: prop,
      node: decl,
      ruleName,
      result,
    })
  })
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
module.exports = { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
