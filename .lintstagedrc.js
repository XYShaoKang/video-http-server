const { ESLint } = require('eslint')
const filterAsync = require('node-filter-async').default
const prettier = require('prettier')

const eslintCli = new ESLint()

const removeIgnoredFiles = async files => {
  const filteredFiles = await filterAsync(files, async file => {
    const isIgnored = await eslintCli.isPathIgnored(file)
    console.log('isIgnored', file, isIgnored)
    return !isIgnored
  })
  return filteredFiles.join(' ')
}

module.exports = {
  'apps/**/*.{ts,tsx}': async files => {
    const filesToLint = await removeIgnoredFiles(files)

    return [`eslint --fix --color --max-warnings=0 ${filesToLint}`]
  },
  'apps/**/*.{ts,tsx,md}': [`prettier --write`],
}
