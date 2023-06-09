const { createPlugin } = require('stylelint')
const hasBlock = require('stylelint/lib/utils/hasBlock')
const isStandardSyntaxAtRule = require('stylelint/lib/utils/isStandardSyntaxAtRule')
const rawNodeString = require('stylelint/lib/utils/rawNodeString')
const report = require('stylelint/lib/utils/report')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const whitespaceChecker = require('stylelint/lib/utils/whitespaceChecker')

const ruleName = 'stylistic/at-rule-semicolon-space-before'

const messages = ruleMessages(ruleName, {
  expectedBefore: () => 'Expected single space before ";"',
  rejectedBefore: () => 'Unexpected whitespace before ";"',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/at-rule-semicolon-space-before',
}

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
  const checker = whitespaceChecker('space', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: ['always', 'never'],
    })

    if (!validOptions) {
      return
    }

    root.walkAtRules((atRule) => {
      if (hasBlock(atRule)) {
        return
      }

      if (!isStandardSyntaxAtRule(atRule)) {
        return
      }

      const nodeString = rawNodeString(atRule)

      checker.before({
        source: nodeString,
        index: nodeString.length,
        err: (m) => {
          report({
            message: m,
            node: atRule,
            index: nodeString.length - 1,
            result,
            ruleName,
          })
        },
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
module.exports = { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
