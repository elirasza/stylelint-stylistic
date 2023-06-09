const { createPlugin } = require('stylelint')
const hasBlock = require('stylelint/lib/utils/hasBlock')
const isStandardSyntaxAtRule = require('stylelint/lib/utils/isStandardSyntaxAtRule')
const nextNonCommentNode = require('stylelint/lib/utils/nextNonCommentNode')
const rawNodeString = require('stylelint/lib/utils/rawNodeString')
const report = require('stylelint/lib/utils/report')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const whitespaceChecker = require('stylelint/lib/utils/whitespaceChecker')

const ruleName = 'stylistic/at-rule-semicolon-newline-after'

const messages = ruleMessages(ruleName, {
  expectedAfter: () => 'Expected newline after ";"',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/at-rule-semicolon-newline-after',
  fixable: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondary, context) => {
  const checker = whitespaceChecker('newline', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: ['always'],
    })

    if (!validOptions) {
      return
    }

    root.walkAtRules((atRule) => {
      const nextNode = atRule.next()

      if (!nextNode) {
        return
      }

      if (hasBlock(atRule)) {
        return
      }

      if (!isStandardSyntaxAtRule(atRule)) {
        return
      }

      // Allow an end-of-line comment
      const nodeToCheck = nextNonCommentNode(nextNode)

      if (!nodeToCheck) {
        return
      }

      checker.afterOneOnly({
        source: rawNodeString(nodeToCheck),
        index: -1,
        err: (msg) => {
          if (context.fix) {
            nodeToCheck.raws.before = context.newline + nodeToCheck.raws.before
          } else {
            report({
              message: msg,
              node: atRule,
              index: atRule.toString().length + 1,
              result,
              ruleName,
            })
          }
        },
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
module.exports = { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
