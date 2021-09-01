/// <reference types="koa__router" />
import Router from '@koa/router';
declare const router: Router<any, {}>;
export declare const getInfoWithVideoPath: import("Function/Curry").Curry<(parentPath: string) => import("./getInfo").DirInfo | {
    name: string;
    isDirectory: false;
    path: string;
    modified: Date;
    mimetype: string;
    size: number;
}> & ((parentPath: string) => import("./getInfo").DirInfo | {
    name: string;
    isDirectory: false;
    path: string;
    modified: Date;
    mimetype: string;
    size: number;
});
export { router };
