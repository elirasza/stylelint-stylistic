const { createPlugin } = require('stylelint')
const beforeBlockString = require('stylelint/lib/utils/beforeBlockString')
const blockString = require('stylelint/lib/utils/blockString')
const hasBlock = require('stylelint/lib/utils/hasBlock')
const hasEmptyBlock = require('stylelint/lib/utils/hasEmptyBlock')
const report = require('stylelint/lib/utils/report')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const whitespaceChecker = require('stylelint/lib/utils/whitespaceChecker')

const ruleName = 'stylistic/block-opening-brace-newline-before'

const messages = ruleMessages(ruleName, {
  expectedBefore: () => 'Expected newline before "{"',
  expectedBeforeSingleLine: () => 'Expected newline before "{" of a single-line block',
  rejectedBeforeSingleLine: () => 'Unexpected whitespace before "{" of a single-line block',
  expectedBeforeMultiLine: () => 'Expected newline before "{" of a multi-line block',
  rejectedBeforeMultiLine: () => 'Unexpected whitespace before "{" of a multi-line block',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/block-opening-brace-newline-before',
  fixable: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
  const checker = whitespaceChecker('newline', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [
        'always',
        'always-single-line',
        'never-single-line',
        'always-multi-line',
        'never-multi-line',
      ],
    })

    if (!validOptions) {
      return
    }

    // Check both kinds of statement: rules and at-rules
    root.walkRules(check)
    root.walkAtRules(check)

    /**
     * @param {import('postcss').Rule | import('postcss').AtRule} statement
     */
    function check(statement) {
      // Return early if blockless or has an empty block
      if (!hasBlock(statement) || hasEmptyBlock(statement)) {
        return
      }

      const source = beforeBlockString(statement)
      const beforeBraceNoRaw = beforeBlockString(statement, {
        noRawBefore: true,
      })

      let index = beforeBraceNoRaw.length - 1

      if (beforeBraceNoRaw[index - 1] === '\r') {
        index -= 1
      }

      checker.beforeAllowingIndentation({
        lineCheckStr: blockString(statement),
        source,
        index: source.length,
        err: (m) => {
          if (context.fix) {
            const statementRaws = statement.raws

            if (typeof statementRaws.between !== 'string') return

            if (primary.startsWith('always')) {
              const spaceIndex = statementRaws.between.search(/\s+$/)

              if (spaceIndex >= 0) {
                statement.raws.between = statementRaws.between.slice(0, spaceIndex)
                  + context.newline
                  + statementRaws.between.slice(spaceIndex)
              } else {
                statementRaws.between += context.newline
              }

              return
            }

            if (primary.startsWith('never')) {
              statementRaws.between = statementRaws.between.replace(/\s*$/, '')

              return
            }
          }

          report({
            message: m,
            node: statement,
            index,
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
