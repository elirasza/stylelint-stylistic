const { createPlugin } = require('stylelint')
const blockString = require('stylelint/lib/utils/blockString')
const hasBlock = require('stylelint/lib/utils/hasBlock')
const optionsMatches = require('stylelint/lib/utils/optionsMatches')
const rawNodeString = require('stylelint/lib/utils/rawNodeString')
const report = require('stylelint/lib/utils/report')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const whitespaceChecker = require('stylelint/lib/utils/whitespaceChecker')
const { isString } = require('stylelint/lib/utils/validateTypes')

const ruleName = 'stylistic/block-closing-brace-newline-after'

const messages = ruleMessages(ruleName, {
  expectedAfter: () => 'Expected newline after "}"',
  expectedAfterSingleLine: () => 'Expected newline after "}" of a single-line block',
  rejectedAfterSingleLine: () => 'Unexpected whitespace after "}" of a single-line block',
  expectedAfterMultiLine: () => 'Expected newline after "}" of a multi-line block',
  rejectedAfterMultiLine: () => 'Unexpected whitespace after "}" of a multi-line block',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/block-closing-brace-newline-after',
  fixable: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
  const checker = whitespaceChecker('newline', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(
      result,
      ruleName,
      {
        actual: primary,
        possible: [
          'always',
          'always-single-line',
          'never-single-line',
          'always-multi-line',
          'never-multi-line',
        ],
      },
      {
        actual: secondaryOptions,
        possible: {
          ignoreAtRules: [isString],
        },
        optional: true,
      },
    )

    if (!validOptions) {
      return
    }

    // Check both kinds of statements: rules and at-rules
    root.walkRules(check)
    root.walkAtRules(check)

    /**
     * @param {import('postcss').Rule | import('postcss').AtRule} statement
     */
    function check(statement) {
      if (!hasBlock(statement)) {
        return
      }

      if (
        statement.type === 'atrule'
        && optionsMatches(secondaryOptions, 'ignoreAtRules', statement.name)
      ) {
        return
      }

      const nextNode = statement.next()

      if (!nextNode) {
        return
      }

      // Allow an end-of-line comment x spaces after the brace
      const nextNodeIsSingleLineComment = nextNode.type === 'comment'
        && !/[^ ]/.test(nextNode.raws.before || '')
        && !nextNode.toString().includes('\n')

      const nodeToCheck = nextNodeIsSingleLineComment ? nextNode.next() : nextNode

      if (!nodeToCheck) {
        return
      }

      let reportIndex = statement.toString().length
      let source = rawNodeString(nodeToCheck)

      // Skip a semicolon at the beginning, if any
      if (source && source.startsWith(';')) {
        source = source.slice(1)
        reportIndex += 1
      }

      // Only check one after, because there might be other
      // spaces handled by the indentation rule
      checker.afterOneOnly({
        source,
        index: -1,
        lineCheckStr: blockString(statement),
        err: (msg) => {
          if (context.fix) {
            const nodeToCheckRaws = nodeToCheck.raws

            if (typeof nodeToCheckRaws.before !== 'string') return

            if (primary.startsWith('always')) {
              const index = nodeToCheckRaws.before.search(/\r?\n/)

              nodeToCheckRaws.before = index >= 0
                ? nodeToCheckRaws.before.slice(index)
                : context.newline + nodeToCheckRaws.before

              return
            }

            if (primary.startsWith('never')) {
              nodeToCheckRaws.before = ''

              return
            }
          }

          report({
            message: msg,
            node: statement,
            index: reportIndex,
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
