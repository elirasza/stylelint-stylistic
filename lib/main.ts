import { resolve } from 'path'
import { readdirSync } from 'fs'
import { Plugin } from 'stylelint'

export default readdirSync(resolve(`${__dirname}/rules`)).map((rule) => require(`./rules/${rule}`).plugin as Plugin)
