"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = exports.clearConsole = exports.extractIpv4Address = void 0;
const tslib_1 = require("tslib");
const ramda_1 = require("ramda");
const log_update_1 = (0, tslib_1.__importDefault)(require("log-update"));
const filterIpv4 = (0, ramda_1.filter)(network => network?.family.toLowerCase() === 'ipv4');
exports.extractIpv4Address = (0, ramda_1.pipe)(ramda_1.values, ramda_1.flatten, filterIpv4, (0, ramda_1.map)((0, ramda_1.path)(['address'])));
const clearConsole = () => {
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
};
exports.clearConsole = clearConsole;
let logStr = '';
const logUpdatePrint = (str, clear) => {
    if (clear) {
        logStr = str;
    }
    else {
        logStr += str;
    }
    (0, log_update_1.default)(logStr);
};
const print = (str, clear) => {
    if (process.env.TS_NODE_DEV || process.env.VSCODE_BUGGER) {
        // 开发模式下,使用 `console.log` 来输出
        console.log(str);
    }
    else {
        logUpdatePrint(str + '\n', clear);
    }
};
exports.print = print;
//# sourceMappingURL=utils.js.map