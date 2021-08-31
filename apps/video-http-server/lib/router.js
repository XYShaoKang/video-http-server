"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const mime_types_1 = (0, tslib_1.__importDefault)(require("mime-types"));
const router_1 = (0, tslib_1.__importDefault)(require("@koa/router"));
const router = new router_1.default();
exports.router = router;
const INLUDE_TYPEs = new Set(['video/mp4']);
const VIDEO_PATH = path_1.default.join(__dirname, '../videos/');
function getInfo(absolutePath) {
    const stat = fs_1.default.statSync(absolutePath);
    const list = [];
    const isDirectory = stat.isDirectory();
    if (isDirectory) {
        const tempList = fs_1.default.readdirSync(absolutePath);
        for (let i = 0; i < tempList.length; i++) {
            const tempPath = path_1.default.join(absolutePath, tempList[i]);
            const stat = fs_1.default.statSync(tempPath);
            if (stat.isDirectory()) {
                list.push({
                    name: tempList[i],
                    isDirectory: true,
                });
            }
            else {
                const type = mime_types_1.default.lookup(tempPath);
                if (type && INLUDE_TYPEs.has(type)) {
                    list.push({
                        name: tempList[i],
                        type,
                        relativePath: '/' + path_1.default.relative(VIDEO_PATH, tempPath),
                    });
                }
            }
        }
        return { isDirectory, children: list };
    }
    else {
        const filename = path_1.default.basename(absolutePath);
        const mimetype = mime_types_1.default.contentType(filename) || 'application/octet-stream';
        return { isDirectory, mimetype, filename, size: stat.size };
    }
}
router.get('/dir', async (ctx, _next) => {
    const { relativePath } = ctx.query;
    if (relativePath && typeof relativePath === 'string') {
        const absolutePath = path_1.default.join(VIDEO_PATH, relativePath);
        const info = getInfo(absolutePath);
        if (info.isDirectory) {
            ctx.response.body = {
                msg: 'ok',
                children: info.children,
            };
        }
        else {
            ctx.response.body = {
                error: 'not is directory',
            };
        }
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
        const absolutePath = path_1.default.join(VIDEO_PATH, relativePath);
        const info = getInfo(absolutePath);
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
//# sourceMappingURL=router.js.map