const { createPlugin } = require('stylelint')
const fixer = require('stylelint/lib/rules/functionCommaSpaceFix')
const functionCommaSpaceChecker = require('stylelint/lib/rules/functionCommaSpaceChecker')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const whitespaceChecker = require('stylelint/lib/utils/whitespaceChecker')

const ruleName = 'stylistic/function-comma-newline-after'

const messages = ruleMessages(ruleName, {
  expectedAfter: () => 'Expected newline after ","',
  expectedAfterMultiLine: () => 'Expected newline after "," in a multi-line function',
  rejectedAfterMultiLine: () => 'Unexpected whitespace after "," in a multi-line function',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/function-comma-newline-after',
  fixable: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
  const checker = whitespaceChecker('newline', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: ['always', 'always-multi-line', 'never-multi-line'],
    })

    if (!validOptions) {
      return
    }

    functionCommaSpaceChecker({
      root,
      result,
      locationChecker: checker.afterOneOnly,
      checkedRuleName: ruleName,
      fix: context.fix
        ? (div, index, nodes) => fixer({
          div,
          index,
          nodes,
          expectation: primary,
          position: 'after',
          symb: context.newline || '',
        })
        : null,
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
module.exports = { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
