const { createPlugin } = require('stylelint')
const getDeclarationValue = require('stylelint/lib/utils/getDeclarationValue')
const report = require('stylelint/lib/utils/report')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const setDeclarationValue = require('stylelint/lib/utils/setDeclarationValue')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const { isNumber } = require('stylelint/lib/utils/validateTypes')

const ruleName = 'stylistic/value-list-max-empty-lines'

const messages = ruleMessages(ruleName, {
  expected: (max) => `Expected no more than ${max} empty ${max === 1 ? 'line' : 'lines'}`,
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/value-list-max-empty-lines',
  fixable: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
  const maxAdjacentNewlines = primary + 1

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: isNumber,
    })

    if (!validOptions) {
      return
    }

    const violatedCRLFNewLinesRegex = new RegExp(`(?:\r\n){${maxAdjacentNewlines + 1},}`)
    const violatedLFNewLinesRegex = new RegExp(`\n{${maxAdjacentNewlines + 1},}`)
    const allowedLFNewLinesString = context.fix ? '\n'.repeat(maxAdjacentNewlines) : ''
    const allowedCRLFNewLinesString = context.fix ? '\r\n'.repeat(maxAdjacentNewlines) : ''

    root.walkDecls((decl) => {
      const value = getDeclarationValue(decl)

      if (context.fix) {
        const newValueString = value
          .replace(new RegExp(violatedLFNewLinesRegex, 'gm'), allowedLFNewLinesString)
          .replace(new RegExp(violatedCRLFNewLinesRegex, 'gm'), allowedCRLFNewLinesString)

        setDeclarationValue(decl, newValueString)
      } else if (violatedLFNewLinesRegex.test(value) || violatedCRLFNewLinesRegex.test(value)) {
        report({
          message: messages.expected(primary),
          node: decl,
          index: 0,
          result,
          ruleName,
        })
      }
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
module.exports = { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
