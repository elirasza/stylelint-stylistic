const { createPlugin } = require('stylelint')
const atRuleNameSpaceChecker = require('stylelint/lib/rules/atRuleNameSpaceChecker')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const whitespaceChecker = require('stylelint/lib/utils/whitespaceChecker')

const ruleName = 'stylistic/at-rule-name-space-after'

const messages = ruleMessages(ruleName, {
  expectedAfter: (name) => `Expected single space after at-rule name "${name}"`,
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/at-rule-name-space-after',
  fixable: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondary, context) => {
  const checker = whitespaceChecker('space', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: ['always', 'always-single-line'],
    })

    if (!validOptions) {
      return
    }

    atRuleNameSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
      fix: context.fix
        ? (atRule) => {
          if (typeof atRule.raws.afterName === 'string') {
            atRule.raws.afterName = atRule.raws.afterName.replace(/^\s*/, ' ')
          }
        }
        : null,
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
module.exports = { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
