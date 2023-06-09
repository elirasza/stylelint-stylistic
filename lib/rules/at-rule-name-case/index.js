const { createPlugin } = require('stylelint')
const isStandardSyntaxAtRule = require('stylelint/lib/utils/isStandardSyntaxAtRule')
const report = require('stylelint/lib/utils/report')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const validateOptions = require('stylelint/lib/utils/validateOptions')

const ruleName = 'stylistic/at-rule-name-case'

const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/at-rule-name-case',
  fixable: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondary, context) => (root, result) => {
  const validOptions = validateOptions(result, ruleName, {
    actual: primary,
    possible: ['lower', 'upper'],
  })

  if (!validOptions) {
    return
  }

  /** @type {'lower' | 'upper'} */
  const expectation = primary

  root.walkAtRules((atRule) => {
    if (!isStandardSyntaxAtRule(atRule)) {
      return
    }

    const { name } = atRule

    const expectedName = expectation === 'lower' ? name.toLowerCase() : name.toUpperCase()

    if (name === expectedName) {
      return
    }

    if (context.fix) {
      atRule.name = expectedName

      return
    }

    report({
      message: messages.expected(name, expectedName),
      node: atRule,
      ruleName,
      result,
    })
  })
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
module.exports = { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
