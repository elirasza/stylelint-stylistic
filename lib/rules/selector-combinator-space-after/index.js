const { createPlugin } = require('stylelint')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const whitespaceChecker = require('stylelint/lib/utils/whitespaceChecker')
const selectorCombinatorSpaceChecker = require('stylelint/lib/rules/selectorCombinatorSpaceChecker')

const ruleName = 'stylistic/selector-combinator-space-after'

const messages = ruleMessages(ruleName, {
  expectedAfter: (combinator) => `Expected single space after "${combinator}"`,
  rejectedAfter: (combinator) => `Unexpected whitespace after "${combinator}"`,
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/selector-combinator-space-after',
  fixable: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
  const checker = whitespaceChecker('space', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: ['always', 'never'],
    })

    if (!validOptions) {
      return
    }

    selectorCombinatorSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      locationType: 'after',
      checkedRuleName: ruleName,
      fix: context.fix
        ? (combinator) => {
          if (primary === 'always') {
            combinator.spaces.after = ' '

            return true
          }

          if (primary === 'never') {
            combinator.spaces.after = ''

            return true
          }

          return false
        }
        : null,
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
module.exports = { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
