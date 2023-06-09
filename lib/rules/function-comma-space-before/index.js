const { createPlugin } = require('stylelint')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const whitespaceChecker = require('stylelint/lib/utils/whitespaceChecker')
const functionCommaSpaceChecker = require('stylelint/lib/rules/functionCommaSpaceChecker')
const fixer = require('stylelint/lib/rules/functionCommaSpaceFix')

const ruleName = 'stylistic/function-comma-space-before'

const messages = ruleMessages(ruleName, {
  expectedBefore: () => 'Expected single space before ","',
  rejectedBefore: () => 'Unexpected whitespace before ","',
  expectedBeforeSingleLine: () => 'Expected single space before "," in a single-line function',
  rejectedBeforeSingleLine: () => 'Unexpected whitespace before "," in a single-line function',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/function-comma-space-before',
  fixable: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
  const checker = whitespaceChecker('space', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: ['always', 'never', 'always-single-line', 'never-single-line'],
    })

    if (!validOptions) {
      return
    }

    functionCommaSpaceChecker({
      root,
      result,
      locationChecker: checker.before,
      checkedRuleName: ruleName,
      fix: context.fix
        ? (div, index, nodes) => fixer({
          div,
          index,
          nodes,
          expectation: primary,
          position: 'before',
          symb: ' ',
        })
        : null,
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
module.exports = { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
