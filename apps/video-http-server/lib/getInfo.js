"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfo = void 0;
const tslib_1 = require("tslib");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const mime_types_1 = (0, tslib_1.__importDefault)(require("mime-types"));
const ramda_1 = require("ramda");
const INLUDE_TYPEs = new Set(['video/mp4']);
/**
 *
 * @param rootPath Web 的根目录,绝对路径,用来定位当前路径
 * @param currentPath 当前路径,绝对路径
 * @returns
 */
function getInfo(rootPath, currentPath) {
    const relativePath = '/' + path_1.default.relative(rootPath, currentPath);
    const parentName = relativePath === '/' ? 'root' : path_1.default.basename(currentPath);
    const stat = fs_1.default.statSync(currentPath);
    const isDirectory = stat.isDirectory();
    let parentInfo;
    if (isDirectory) {
        const children = [];
        const tempList = fs_1.default.readdirSync(currentPath);
        for (let i = 0; i < tempList.length; i++) {
            const tempPath = path_1.default.join(currentPath, tempList[i]);
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
//# sourceMappingURL=getInfo.js.map