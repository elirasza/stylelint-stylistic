const { createPlugin } = require('stylelint')
const declarationValueIndex = require('stylelint/lib/utils/declarationValueIndex')
const getDeclarationValue = require('stylelint/lib/utils/getDeclarationValue')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const setDeclarationValue = require('stylelint/lib/utils/setDeclarationValue')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const whitespaceChecker = require('stylelint/lib/utils/whitespaceChecker')
const valueListCommaWhitespaceChecker = require('stylelint/lib/rules/valueListCommaWhitespaceChecker')

const ruleName = 'stylistic/value-list-comma-newline-after'

const messages = ruleMessages(ruleName, {
  expectedAfter: () => 'Expected newline after ","',
  expectedAfterMultiLine: () => 'Expected newline after "," in a multi-line list',
  rejectedAfterMultiLine: () => 'Unexpected whitespace after "," in a multi-line list',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/value-list-comma-newline-after',
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

    /** @type {Map<import('postcss').Declaration, number[]> | undefined} */
    let fixData

    valueListCommaWhitespaceChecker({
      root,
      result,
      locationChecker: checker.afterOneOnly,
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
      determineIndex: (declString, match) => {
        const nextChars = declString.substring(match.endIndex, declString.length)

        // If there's a // comment, that means there has to be a newline
        // ending the comment so we're fine
        if (/^[ \t]*\/\//.test(nextChars)) {
          return false
        }

        // If there are spaces and then a comment begins, look for the newline
        return /^[ \t]*\/\*/.test(nextChars)
          ? declString.indexOf('*/', match.endIndex) + 1
          : match.startIndex
      },
    })

    if (fixData) {
      for (const [decl, commaIndices] of fixData.entries()) {
        for (const index of commaIndices.sort((a, b) => a - b).reverse()) {
          const value = getDeclarationValue(decl)
          const valueIndex = index - declarationValueIndex(decl)
          const beforeValue = value.slice(0, valueIndex + 1)
          let afterValue = value.slice(valueIndex + 1)

          if (primary.startsWith('always')) {
            afterValue = context.newline + afterValue
          } else if (primary.startsWith('never-multi-line')) {
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
