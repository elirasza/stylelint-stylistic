const { createPlugin } = require('stylelint')
const report = require('stylelint/lib/utils/report')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const { isNumber } = require('stylelint/lib/utils/validateTypes')

const ruleName = 'stylistic/selector-max-empty-lines'

const messages = ruleMessages(ruleName, {
  expected: (max) => `Expected no more than ${max} empty ${max === 1 ? 'line' : 'lines'}`,
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/selector-max-empty-lines',
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

    root.walkRules((ruleNode) => {
      const selector = ruleNode.raws.selector ? ruleNode.raws.selector.raw : ruleNode.selector

      if (context.fix) {
        const newSelectorString = selector
          .replace(new RegExp(violatedLFNewLinesRegex, 'gm'), allowedLFNewLinesString)
          .replace(new RegExp(violatedCRLFNewLinesRegex, 'gm'), allowedCRLFNewLinesString)

        if (ruleNode.raws.selector) {
          ruleNode.raws.selector.raw = newSelectorString
        } else {
          ruleNode.selector = newSelectorString
        }
      } else if (
        violatedLFNewLinesRegex.test(selector)
        || violatedCRLFNewLinesRegex.test(selector)
      ) {
        report({
          message: messages.expected(primary),
          node: ruleNode,
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
