# stylelint-stylistic

![main branch quality workflow](https://github.com/elirasza/stylelint-stylistic/actions/workflows/quality.yml/badge.svg?branch=main)
![latest tag release workflow](https://github.com/elirasza/stylelint-stylistic/actions/workflows/release.yml/badge.svg?event=push)

Plugin for endangered stylelint stylistic rules.

As of its version 15, the popular [stylelint](https://stylelint.io/) package will slowly [deprecate and remove 76 stylistic rules](https://stylelint.io/migration-guide/to-15/).

The proposed solution was to move to other specialized formatting packages like [prettier](https://prettier.io/), but it proved to be a tedious task on large projects. Not all of them are able to shift easily and fix the potential conflicts between different linters / formatters (especially on hybrid linting environments such as CSS-in-JS).

As these endangered rules were working quite well, and alongside the stylelint reco mmendation, I decided to move them to this package in order to maintain them. Only a soft migration will be need to keep them in your projects.

## 1. Getting started

### Requirements

You will need [stylelint](https://www.npmjs.com/package/stylelint) 15.0.0 or higher as a peer dependency.

Install the package :

```bash
npm install stylelint-stylistic --save-dev
```
or
```bash
yarn add stylelint-stylistic --dev
```

Then, append the plugin to your stylelint configuration plugins :

```json
{
  "plugins": [
    "stylelint-stylistic"
  ]
}
```

Or alternatively, if you wish to use the plugin default config, you can directly extend it :

```json
{
  "extends": [
    "stylelint-stylistic/config"
  ]
}
```

## 2. Rules

All rules were moved, according to `stylelint` plugin convention, to the `stylistic` scope. If you already have some of them in your configuration, juste changed any `rule` to `stylistic/rule`.

| Rule                                                                                                                   | Auto-fixable |
| ---------------------------------------------------------------------------------------------------------------------- | ------------ |
| [stylistic/at-rule-name-case](./lib/rules/at-rule-name-case)                                                           | yes          |
| [stylistic/at-rule-name-newline-after](./lib/rules/at-rule-name-newline-after)                                         | **no**       |
| [stylistic/at-rule-name-space-after](./lib/rules/at-rule-name-space-after)                                             | yes          |
| [stylistic/at-rule-semicolon-newline-after](./lib/rules/at-rule-semicolon-newline-after)                               | yes          |
| [stylistic/at-rule-semicolon-space-before](./lib/rules/at-rule-semicolon-space-before)                                 | **no**       |
| [stylistic/block-closing-brace-empty-line-before](./lib/rules/block-closing-brace-empty-line-before)                   | yes          |
| [stylistic/block-closing-brace-newline-after](./lib/rules/block-closing-brace-newline-after)                           | yes          |
| [stylistic/block-closing-brace-newline-before](./lib/rules/block-closing-brace-newline-before)                         | yes          |
| [stylistic/block-closing-brace-space-after](./lib/rules/block-closing-brace-space-after)                               | **no**       |
| [stylistic/block-closing-brace-space-before](./lib/rules/block-closing-brace-space-before)                             | yes          |
| [stylistic/block-opening-brace-newline-after](./lib/rules/block-opening-brace-newline-after)                           | yes          |
| [stylistic/block-opening-brace-newline-before](./lib/rules/block-opening-brace-newline-before)                         | yes          |
| [stylistic/block-opening-brace-space-after](./lib/rules/block-opening-brace-space-after)                               | yes          |
| [stylistic/block-opening-brace-space-before](./lib/rules/block-opening-brace-space-before)                             | yes          |
| [stylistic/color-hex-case](./lib/rules/color-hex-case)                                                                 | yes          |
| [stylistic/declaration-bang-space-after](./lib/rules/declaration-bang-space-after)                                     | yes          |
| [stylistic/declaration-bang-space-before](./lib/rules/declaration-bang-space-before)                                   | yes          |
| [stylistic/declaration-block-semicolon-newline-after](./lib/rules/declaration-block-semicolon-newline-after)           | yes          |
| [stylistic/declaration-block-semicolon-newline-before](./lib/rules/declaration-block-semicolon-newline-before)         | **no**       |
| [stylistic/declaration-block-semicolon-space-after](./lib/rules/declaration-block-semicolon-space-after)               | yes          |
| [stylistic/declaration-block-semicolon-space-before](./lib/rules/declaration-block-semicolon-space-before)             | yes          |
| [stylistic/declaration-block-trailing-semicolon](./lib/rules/declaration-block-trailing-semicolon)                     | **no**       |
| [stylistic/declaration-colon-newline-after](./lib/rules/declaration-colon-newline-after)                               | yes          |
| [stylistic/declaration-colon-space-after](./lib/rules/declaration-colon-space-after)                                   | yes          |
| [stylistic/declaration-colon-space-before](./lib/rules/declaration-colon-space-before)                                 | yes          |
| [stylistic/function-comma-newline-after](./lib/rules/function-comma-newline-after)                                     | yes          |
| [stylistic/function-comma-newline-before](./lib/rules/function-comma-newline-before)                                   | yes          |
| [stylistic/function-comma-space-after](./lib/rules/function-comma-space-after)                                         | yes          |
| [stylistic/function-comma-space-before](./lib/rules/function-comma-space-before)                                       | yes          |
| [stylistic/function-max-empty-lines](./lib/rules/function-max-empty-lines)                                             | yes          |
| [stylistic/function-parentheses-newline-inside](./lib/rules/function-parentheses-newline-inside)                       | yes          |
| [stylistic/function-parentheses-space-inside](./lib/rules/function-parentheses-space-inside)                           | yes          |
| [stylistic/function-whitespace-after](./lib/rules/function-whitespace-after)                                           | yes          |
| [stylistic/indentation](./lib/rules/indentation)                                                                       | yes          |
| [stylistic/linebreaks](./lib/rules/linebreaks)                                                                         | yes          |
| [stylistic/max-empty-lines](./lib/rules/max-empty-lines)                                                               | yes          |
| [stylistic/max-line-length](./lib/rules/max-line-length)                                                               | **no**       |
| [stylistic/media-feature-colon-space-after](./lib/rules/media-feature-colon-space-after)                               | yes          |
| [stylistic/media-feature-colon-space-before](./lib/rules/media-feature-colon-space-before)                             | yes          |
| [stylistic/media-feature-name-case](./lib/rules/media-feature-name-case)                                               | yes          |
| [stylistic/media-feature-parentheses-space-inside](./lib/rules/media-feature-parentheses-space-inside)                 | yes          |
| [stylistic/media-feature-range-operator-space-after](./lib/rules/media-feature-range-operator-space-after)             | yes          |
| [stylistic/media-feature-range-operator-space-before](./lib/rules/media-feature-range-operator-space-before)           | yes          |
| [stylistic/media-query-list-comma-newline-after](./lib/rules/media-query-list-comma-newline-after)                     | yes          |
| [stylistic/media-query-list-comma-newline-before](./lib/rules/media-query-list-comma-newline-before)                   | **no**       |
| [stylistic/media-query-list-comma-space-after](./lib/rules/media-query-list-comma-space-after)                         | yes          |
| [stylistic/media-query-list-comma-space-before](./lib/rules/media-query-list-comma-space-before)                       | yes          |
| [stylistic/no-empty-first-line](./lib/rules/no-empty-first-line)                                                       | yes          |
| [stylistic/no-eol-whitespace](./lib/rules/no-eol-whitespace)                                                           | yes          |
| [stylistic/no-extra-semicolons](./lib/rules/no-extra-semicolons)                                                       | yes          |
| [stylistic/no-missing-end-of-source-newline](./lib/rules/no-missing-end-of-source-newline)                             | yes          |
| [stylistic/number-leading-zero](./lib/rules/number-leading-zero)                                                       | yes          |
| [stylistic/number-no-trailing-zeros](./lib/rules/number-no-trailing-zeros)                                             | yes          |
| [stylistic/property-case](./lib/rules/property-case)                                                                   | yes          |
| [stylistic/selector-attribute-brackets-space-inside](./lib/rules/selector-attribute-brackets-space-inside)             | yes          |
| [stylistic/selector-attribute-operator-space-after](./lib/rules/selector-attribute-operator-space-after)               | yes          |
| [stylistic/selector-attribute-operator-space-before](./lib/rules/selector-attribute-operator-space-before)             | yes          |
| [stylistic/selector-combinator-space-after](./lib/rules/selector-combinator-space-after)                               | yes          |
| [stylistic/selector-combinator-space-before](./lib/rules/selector-combinator-space-before)                             | yes          |
| [stylistic/selector-descendant-combinator-no-non-space](./lib/rules/selector-descendant-combinator-no-non-space)       | yes          |
| [stylistic/selector-list-comma-newline-after](./lib/rules/selector-list-comma-newline-after)                           | yes          |
| [stylistic/selector-list-comma-newline-before](./lib/rules/selector-list-comma-newline-before)                         | yes          |
| [stylistic/selector-list-comma-space-after](./lib/rules/selector-list-comma-space-after)                               | yes          |
| [stylistic/selector-list-comma-space-before](./lib/rules/selector-list-comma-space-before)                             | yes          |
| [stylistic/selector-max-empty-lines](./lib/rules/selector-max-empty-lines)                                             | yes          |
| [stylistic/selector-pseudo-class-case](./lib/rules/selector-pseudo-class-case)                                         | yes          |
| [stylistic/selector-pseudo-class-parentheses-space-inside](./lib/rules/selector-pseudo-class-parentheses-space-inside) | yes          |
| [stylistic/selector-pseudo-element-case](./lib/rules/selector-pseudo-element-case)                                     | yes          |
| [stylistic/string-quotes](./lib/rules/string-quotes)                                                                   | yes          |
| [stylistic/unicode-bom](./lib/rules/unicode-bom)                                                                       | **no**       |
| [stylistic/unit-case](./lib/rules/unit-case)                                                                           | yes          |
| [stylistic/value-list-comma-newline-after](./lib/rules/value-list-comma-newline-after)                                 | yes          |
| [stylistic/value-list-comma-newline-before](./lib/rules/value-list-comma-newline-before)                               | **no**       |
| [stylistic/value-list-comma-space-after](./lib/rules/value-list-comma-space-after)                                     | yes          |
| [stylistic/value-list-comma-space-before](./lib/rules/value-list-comma-space-before)                                   | yes          |
| [stylistic/value-list-max-empty-lines](./lib/rules/value-list-max-empty-lines)                                         | yes          |
