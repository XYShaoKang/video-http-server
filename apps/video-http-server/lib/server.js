"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const tslib_1 = require("tslib");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const koa_1 = (0, tslib_1.__importDefault)(require("koa"));
const koa_bodyparser_1 = (0, tslib_1.__importDefault)(require("koa-bodyparser"));
const koa_static_1 = (0, tslib_1.__importDefault)(require("koa-static"));
const router_1 = require("./router");
const CLIENT_PATH = path_1.default.join(__dirname, '../../front-end/dist/');
const ROOT_PATH = path_1.default.join(__dirname, '../videos/');
const router = (0, router_1.createRoute)(ROOT_PATH);
const app = new koa_1.default();
exports.app = app;
app.use((0, koa_bodyparser_1.default)());
app.use((0, koa_static_1.default)(CLIENT_PATH));
app.use(router.routes()).use(router.allowedMethods());
app.on('error', error => {
    // TODO: 暂时先使用警告来代替错误
    // https://github.com/koajs/koa/issues/1089
    if (error.code === 'EPIPE') {
        console.warn('Koa app-level EPIPE error.', { error });
    }
    else {
        console.error('Koa app-level error', { error });
    }
});
//# sourceMappingURL=server.js.map