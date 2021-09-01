"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.getInfoWithVideoPath = exports.getInfo = void 0;
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const mime_types_1 = (0, tslib_1.__importDefault)(require("mime-types"));
const router_1 = (0, tslib_1.__importDefault)(require("@koa/router"));
const ramda_1 = require("ramda");
const router = new router_1.default();
exports.router = router;
const INLUDE_TYPEs = new Set(['video/mp4']);
const ROOT_PATH = path_1.default.join(__dirname, '../videos/');
/**
 *
 * @param parentPath 当前路径,相对路径
 * @returns
 */
function getInfo(rootPath, parentPath) {
    const relativePath = '/' + path_1.default.relative(rootPath, parentPath);
    const parentName = relativePath === '/' ? 'root' : path_1.default.basename(parentPath);
    const stat = fs_1.default.statSync(parentPath);
    const isDirectory = stat.isDirectory();
    let parentInfo;
    if (isDirectory) {
        const children = [];
        const tempList = fs_1.default.readdirSync(parentPath);
        for (let i = 0; i < tempList.length; i++) {
            const tempPath = path_1.default.join(parentPath, tempList[i]);
            const info = getInfo(rootPath, tempPath);
            let child = info;
            if ('children' in info) {
                child = (0, ramda_1.omit)(['children'], info);
            }
            else if (!INLUDE_TYPEs.has(info.mimetype)) {
                // 过滤其他文件,只显示视频文件
                continue;
            }
            children.push(child);
        }
        parentInfo = {
            name: parentName,
            isDirectory: true,
            path: relativePath,
            modified: stat.mtime,
            children,
        };
    }
    else {
        parentInfo = {
            name: parentName,
            isDirectory: false,
            path: relativePath,
            modified: stat.mtime,
            mimetype: mime_types_1.default.contentType(parentName) || 'application/octet-stream',
            size: stat.size,
        };
    }
    return parentInfo;
}
exports.getInfo = getInfo;
exports.getInfoWithVideoPath = (0, ramda_1.curry)(getInfo)(ROOT_PATH);
router.get('/info', async (ctx, _next) => {
    const { relativePath } = ctx.query;
    if (relativePath && typeof relativePath === 'string') {
        const absolutePath = path_1.default.join(ROOT_PATH, relativePath);
        const info = (0, exports.getInfoWithVideoPath)(absolutePath);
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
        const absolutePath = path_1.default.join(ROOT_PATH, relativePath);
        const info = (0, exports.getInfoWithVideoPath)(absolutePath);
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