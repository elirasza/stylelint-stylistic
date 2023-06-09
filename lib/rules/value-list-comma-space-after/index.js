const { createPlugin } = require('stylelint')
const declarationValueIndex = require('stylelint/lib/utils/declarationValueIndex')
const getDeclarationValue = require('stylelint/lib/utils/getDeclarationValue')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const setDeclarationValue = require('stylelint/lib/utils/setDeclarationValue')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const whitespaceChecker = require('stylelint/lib/utils/whitespaceChecker')
const valueListCommaWhitespaceChecker = require('stylelint/lib/rules/valueListCommaWhitespaceChecker')

const ruleName = 'stylistic/value-list-comma-space-after'

const messages = ruleMessages(ruleName, {
  expectedAfter: () => 'Expected single space after ","',
  rejectedAfter: () => 'Unexpected whitespace after ","',
  expectedAfterSingleLine: () => 'Expected single space after "," in a single-line list',
  rejectedAfterSingleLine: () => 'Unexpected whitespace after "," in a single-line list',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/value-list-comma-space-after',
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

    /** @type {Map<import('postcss').Declaration, number[]> | undefined} */
    let fixData

    valueListCommaWhitespaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
      fix: context.fix
        ? (declNode, index) => {
          const valueIndex = declarationValueIndex(declNode)

          if (index <= valueIndex) {
            return false
          }

          fixData = fixData || new Map()
          const commaIndices = fixData.get(declNode) || []

          commaIndices.push(index)
          fixData.set(declNode, commaIndices)

          return true
        }
        : null,
    })

    if (fixData) {
      for (const [decl, commaIndices] of fixData.entries()) {
        for (const index of commaIndices.sort((a, b) => b - a)) {
          const value = getDeclarationValue(decl)
          const valueIndex = index - declarationValueIndex(decl)
          const beforeValue = value.slice(0, valueIndex + 1)
          let afterValue = value.slice(valueIndex + 1)

          if (primary.startsWith('always')) {
            afterValue = afterValue.replace(/^\s*/, ' ')
          } else if (primary.startsWith('never')) {
            afterValue = afterValue.replace(/^\s*/, '')
          }

          setDeclarationValue(decl, beforeValue + afterValue)
        }
      }
    }
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
module.exports = { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
