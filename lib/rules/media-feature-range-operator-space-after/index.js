const { createPlugin } = require('stylelint')
const atRuleParamIndex = require('stylelint/lib/utils/atRuleParamIndex')
const report = require('stylelint/lib/utils/report')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const whitespaceChecker = require('stylelint/lib/utils/whitespaceChecker')
const findMediaOperator = require('stylelint/lib/rules/findMediaOperator')

const ruleName = 'stylistic/media-feature-range-operator-space-after'

const messages = ruleMessages(ruleName, {
  expectedAfter: () => 'Expected single space after range operator',
  rejectedAfter: () => 'Unexpected whitespace after range operator',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/media-feature-range-operator-space-after',
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

    root.walkAtRules(/^media$/i, (atRule) => {
      /** @type {number[]} */
      const fixOperatorIndices = []
      /** @type {((index: number) => void) | null} */
      const fix = context.fix ? (index) => fixOperatorIndices.push(index) : null

      findMediaOperator(atRule, (match, params, node) => {
        checkAfterOperator(match, params, node, fix)
      })

      if (fixOperatorIndices.length) {
        let params = atRule.raws.params ? atRule.raws.params.raw : atRule.params

        for (const index of fixOperatorIndices.sort((a, b) => b - a)) {
          const beforeOperator = params.slice(0, index + 1)
          const afterOperator = params.slice(index + 1)

          if (primary === 'always') {
            params = beforeOperator + afterOperator.replace(/^\s*/, ' ')
          } else if (primary === 'never') {
            params = beforeOperator + afterOperator.replace(/^\s*/, '')
          }
        }

        if (atRule.raws.params) {
          atRule.raws.params.raw = params
        } else {
          atRule.params = params
        }
      }
    })

    /**
     * @param {import('style-search').StyleSearchMatch} match
     * @param {string} params
     * @param {import('postcss').AtRule} node
     * @param {((index: number) => void) | null} fix
     */
    function checkAfterOperator(match, params, node, fix) {
      const endIndex = match.startIndex + match.target.length - 1

      checker.after({
        source: params,
        index: endIndex,
        err: (m) => {
          if (fix) {
            fix(endIndex)

            return
          }

          report({
            message: m,
            node,
            index: endIndex + atRuleParamIndex(node) + 1,
            result,
            ruleName,
          })
        },
      })
    }
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
module.exports = { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
