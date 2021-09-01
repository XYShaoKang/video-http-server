export declare type DirInfo = {
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
 * @param rootPath Web 的根目录,绝对路径,用来定位当前路径
 * @param currentPath 当前路径,绝对路径
 * @returns
 */
export declare function getInfo(rootPath: string, currentPath: string): Info;
export {};
