const { createPlugin } = require('stylelint')
const declarationValueIndex = require('stylelint/lib/utils/declarationValueIndex')
const getDeclarationValue = require('stylelint/lib/utils/getDeclarationValue')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const setDeclarationValue = require('stylelint/lib/utils/setDeclarationValue')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const valueListCommaWhitespaceChecker = require('stylelint/lib/rules/valueListCommaWhitespaceChecker')
const whitespaceChecker = require('stylelint/lib/utils/whitespaceChecker')

const ruleName = 'stylistic/value-list-comma-space-before'

const messages = ruleMessages(ruleName, {
  expectedBefore: () => 'Expected single space before ","',
  rejectedBefore: () => 'Unexpected whitespace before ","',
  expectedBeforeSingleLine: () => 'Unexpected whitespace before "," in a single-line list',
  rejectedBeforeSingleLine: () => 'Unexpected whitespace before "," in a single-line list',
})

const meta = {
  url: 'https://stylelint.io/user-guide/rules/value-list-comma-space-before',
  fixable: true,
  deprecated: true,
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
      locationChecker: checker.before,
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
          let beforeValue = value.slice(0, valueIndex)
          const afterValue = value.slice(valueIndex)

          if (primary.startsWith('always')) {
            beforeValue = beforeValue.replace(/\s*$/, ' ')
          } else if (primary.startsWith('never')) {
            beforeValue = beforeValue.replace(/\s*$/, '')
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