"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoute = void 0;
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const router_1 = (0, tslib_1.__importDefault)(require("@koa/router"));
const ramda_1 = require("ramda");
const getInfo_1 = require("./getInfo");
function createRoute(rootPath) {
    const router = new router_1.default();
    const getInfoWithVideoPath = (0, ramda_1.curry)(getInfo_1.getInfo)(rootPath);
    router.get('/info', async (ctx, _next) => {
        const { relativePath } = ctx.query;
        if (relativePath && typeof relativePath === 'string') {
            const absolutePath = path_1.default.join(rootPath, relativePath);
            const info = getInfoWithVideoPath(absolutePath);
            ctx.response.body = {
                msg: 'ok',
                info,
            };
        }
        else {
            ctx.response.body = {
                error: 'lack relativePath',
            };
        }
    });
    router.get('/file', async (ctx, _next) => {
        const { relativePath } = ctx.query;
        if (relativePath && typeof relativePath === 'string') {
            const absolutePath = path_1.default.join(rootPath, relativePath);
            const info = getInfoWithVideoPath(absolutePath);
            if (info.isDirectory) {
                ctx.response.body = {
                    error: 'not is file',
                };
            }
            else {
                const { mimetype, size } = info;
                const range = ctx.header.range;
                let start = 0, end = size - 1, chunksize = size;
                if (range) {
                    const parts = range.replace(/bytes=/, '').split('-');
                    start = parseInt(parts[0], 10);
                    end = parts[1] ? parseInt(parts[1], 10) : size - 1;
                    chunksize = end - start + 1;
                    ctx.status = 206;
                    ctx.set('Content-Range', `bytes ${start}-${end}/${size}`);
                }
                else {
                    ctx.status = 200;
                }
                ctx.set('Content-Type', mimetype);
                ctx.set('Accept-Ranges', 'bytes');
                ctx.set('Content-Length', String(chunksize));
                ctx.body = fs_1.default.createReadStream(absolutePath, { start, end });
            }
        }
        else {
            ctx.response.body = {
                error: 'lack relativePath',
            };
        }
    });
    return router;
}
exports.createRoute = createRoute;
//# sourceMappingURL=router.js.map