// source: https://github.com/microsoft/just/blob/47ecde0d578b223a8abf26eebd0eff02ff331988/packages/just-scripts/src/jest/JestReporter.ts

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
