"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs_1 = (0, tslib_1.__importDefault)(require("yargs"));
const helpers_1 = require("yargs/helpers");
const os_1 = (0, tslib_1.__importDefault)(require("os"));
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const server_1 = require("./server");
const utils_1 = require("./utils");
const ifaces = os_1.default.networkInterfaces();
const DEFAULT_PORT = 9011;
const DEFAULT_HOST = '0.0.0.0';
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .options({
    root: {
        default: './',
        describe: 'root path',
        string: true,
    },
    port: {
        alias: 'p',
        default: DEFAULT_PORT,
        describe: 'server port',
        number: true,
    },
    host: {
        alias: 'h',
        default: DEFAULT_HOST,
        describe: 'server host',
        string: true,
    },
})
    .command(['server [root]', '$0'], '启动一个视频服务器', () => {
    //
}, ({ host, port, root = '' }) => {
    const rootPath = path_1.default.join(process.cwd(), root);
    const server = (0, server_1.createServer)(rootPath);
    server.on('close', () => {
        // console.log('server close')
    });
    server.listen(port, host, () => {
        (0, utils_1.print)(chalk_1.default.green('Server running on \n'));
        const logUrl = (address) => address && (0, utils_1.print)(`    http://${address}:${port}`);
        if (host === '0.0.0.0') {
            (0, utils_1.extractIpv4Address)(ifaces).forEach(logUrl);
        }
        else {
            logUrl(host);
        }
        (0, utils_1.print)('\nHit CTRL-C to stop the server');
    });
    const closeHandle = () => {
        (0, utils_1.print)(chalk_1.default.red('video-http-server stopped'), true);
        server.close();
    };
    process.on('SIGINT', closeHandle);
    process.on('SIGTERM', closeHandle);
    process.on('SIGUSR1', closeHandle);
    process.on('SIGUSR2', closeHandle);
    process.on('uncaughtException', closeHandle);
})
    .strict()
    .help().argv;
//# sourceMappingURL=cli.js.map