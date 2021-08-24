"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const koa_1 = (0, tslib_1.__importDefault)(require("koa"));
const koa_bodyparser_1 = (0, tslib_1.__importDefault)(require("koa-bodyparser"));
const koa_static_1 = (0, tslib_1.__importDefault)(require("koa-static"));
const router_1 = require("./router");
const CLIENT_PATH = path_1.default.join(__dirname, '../../front-end/dist/');
const PORT = 3000;
const app = new koa_1.default();
app.use((0, koa_bodyparser_1.default)());
app.use((0, koa_static_1.default)(CLIENT_PATH));
app.use(router_1.router.routes()).use(router_1.router.allowedMethods());
app.on('error', error => {
    // 暂时先使用警告来代替错误
    // https://github.com/koajs/koa/issues/1089
    if (error.code === 'EPIPE') {
        console.warn('Koa app-level EPIPE error.', { error });
    }
    else {
        console.error('Koa app-level error', { error });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map