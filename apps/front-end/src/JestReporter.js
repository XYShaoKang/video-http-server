// This doesn't have types for some reason
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DefaultReporter } = require('@jest/reporters')

/**
 * The purpose of this custom reporter is to prevent Jest from logging to stderr
 * when there are no errors.
 */
class JestReporter extends DefaultReporter {
  _isLoggingError = false

  log(message) {
    if (this._isLoggingError) {
      process.stderr.write(message + '\n')
    } else {
      process.stdout.write(message + '\n')
    }
  }

  printTestFileFailureMessage(...args) {
    this._isLoggingError = true
    super.printTestFileFailureMessage(...args)
    this._isLoggingError = false
  }
}

// jest needs this format
module.exports = JestReporter
