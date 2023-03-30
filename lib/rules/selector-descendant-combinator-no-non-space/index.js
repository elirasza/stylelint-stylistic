const { createPlugin } = require('stylelint')
const isStandardSyntaxRule = require('stylelint/lib/utils/isStandardSyntaxRule')
const parseSelector = require('stylelint/lib/utils/parseSelector')
const report = require('stylelint/lib/utils/report')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const validateOptions = require('stylelint/lib/utils/validateOptions')

const ruleName = 'stylistic/selector-descendant-combinator-no-non-space'

const messages = ruleMessages(ruleName, {
  rejected: (nonSpaceCharacter) => `Unexpected "${nonSpaceCharacter}"`,
})

const meta = {
  url: 'https://stylelint.io/user-guide/rules/selector-descendant-combinator-no-non-space',
  fixable: true,
  deprecated: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => (root, result) => {
  const validOptions = validateOptions(result, ruleName, {
    actual: primary,
  })

  if (!validOptions) {
    return
  }

  root.walkRules((ruleNode) => {
    if (!isStandardSyntaxRule(ruleNode)) {
      return
    }

    let hasFixed = false
    const selector = ruleNode.raws.selector ? ruleNode.raws.selector.raw : ruleNode.selector

    // Return early for selectors containing comments
    // TODO: renable when parser and stylelint are compatible
    if (selector.includes('/*')) return

    const fixedSelector = parseSelector(selector, result, ruleNode, (fullSelector) => {
      fullSelector.walkCombinators((combinatorNode) => {
        if (combinatorNode.value !== ' ') {
          return
        }

        const value = combinatorNode.toString()

        if (
          value.includes('  ')
            || value.includes('\t')
            || value.includes('\n')
            || value.includes('\r')
        ) {
          if (context.fix && /^\s+$/.test(value)) {
            hasFixed = true

            if (!combinatorNode.raws) combinatorNode.raws = {}

            combinatorNode.raws.value = ' '
            combinatorNode.rawSpaceBefore = combinatorNode.rawSpaceBefore.replace(/^\s+/, '')
            combinatorNode.rawSpaceAfter = combinatorNode.rawSpaceAfter.replace(/\s+$/, '')

            return
          }

          report({
            result,
            ruleName,
            message: messages.rejected(value),
            node: ruleNode,
            index: combinatorNode.sourceIndex,
          })
        }
      })
    })

    if (hasFixed && fixedSelector) {
      if (!ruleNode.raws.selector) {
        ruleNode.selector = fixedSelector
      } else {
        ruleNode.raws.selector.raw = fixedSelector
      }
    }
  })
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
module.exports = { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
