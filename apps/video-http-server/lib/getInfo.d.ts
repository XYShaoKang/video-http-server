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
 * @param parentPath 当前路径,相对路径
 * @returns
 */
export declare function getInfo(rootPath: string, parentPath: string): Info;
export {};
