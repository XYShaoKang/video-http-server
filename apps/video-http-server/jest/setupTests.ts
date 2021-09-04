import { Console } from 'console'

// https://github.com/tschaub/mock-fs/issues/234#issuecomment-703740305
// eslint-disable-next-line no-global-assign
global.console = new Console(process.stdout, process.stderr)
