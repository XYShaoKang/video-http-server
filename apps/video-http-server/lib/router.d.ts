/// <reference types="koa__router" />
import Router from '@koa/router';
declare const router: Router<any, {}>;
declare type DirInfo = {
    name: string;
    isDirectory: true;
    path: string;
    modified: Date;
    children: Array<Child>;
};
declare type Child = Omit<DirInfo, 'children'> | FileInfo;
declare type FileInfo = {
    name: string;
    isDirectory: false;
    path: string;
    modified: Date;
    mimetype: string;
    size: number;
};
declare type Info = DirInfo | FileInfo;
/**
 *
 * @param parentPath 当前路径,相对路径
 * @returns
 */
export declare function getInfo(rootPath: string, parentPath: string): Info;
export declare const getInfoWithVideoPath: import("Function/Curry").Curry<(parentPath: string) => Info> & ((parentPath: string) => Info);
export { router };
