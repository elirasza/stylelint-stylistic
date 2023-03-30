const { createPlugin } = require('stylelint')
const declarationValueIndex = require('stylelint/lib/utils/declarationValueIndex')
const getDeclarationValue = require('stylelint/lib/utils/getDeclarationValue')
const ruleMessages = require('stylelint/lib/utils/ruleMessages')
const setDeclarationValue = require('stylelint/lib/utils/setDeclarationValue')
const validateOptions = require('stylelint/lib/utils/validateOptions')
const whitespaceChecker = require('stylelint/lib/utils/whitespaceChecker')
const declarationBangSpaceChecker = require('stylelint/lib/rules/declarationBangSpaceChecker')

const ruleName = 'stylistic/declaration-bang-space-before'

const messages = ruleMessages(ruleName, {
  expectedBefore: () => 'Expected single space before "!"',
  rejectedBefore: () => 'Unexpected whitespace before "!"',
})

const meta = {
  url: 'https://stylelint.io/user-guide/rules/declaration-bang-space-before',
  fixable: true,
  deprecated: true,
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

    declarationBangSpaceChecker({
      root,
      result,
      locationChecker: checker.before,
      checkedRuleName: ruleName,
      fix: context.fix
        ? (decl, index) => {
          let bangIndex = index - declarationValueIndex(decl)
          const value = getDeclarationValue(decl)
          let target
          /** @type {(val: string) => void} */
          let setFixed

          if (bangIndex < value.length) {
            target = value
            setFixed = (val) => {
              setDeclarationValue(decl, val)
            }
          } else if (decl.important) {
            target = decl.raws.important || ' !important'
            bangIndex -= value.length
            setFixed = (val) => {
              decl.raws.important = val
            }
          } else {
            return false // not standard
          }

          const targetBefore = target.slice(0, bangIndex)
          const targetAfter = target.slice(bangIndex)

          if (primary === 'always') {
            // eslint-disable-next-line prefer-template
            setFixed(targetBefore.replace(/\s*$/, '') + ' ' + targetAfter)

            return true
          }

          if (primary === 'never') {
            setFixed(targetBefore.replace(/\s*$/, '') + targetAfter)

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
