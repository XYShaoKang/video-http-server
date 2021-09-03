# 维护指南

## 先决条件

- [Git](https://git-scm.com/)
- [Node](https://nodejs.org/): 开发环境使用`Node.js v14.16.0`,其他版本暂未测试
- [pnpm](https://pnpm.io): 包管理工具
  - [pnpm installation](https://pnpm.io/installation) 查看文档安装
- [Rush](https://github.com/Microsoft/web-build-tools/wiki/Rush): 使用 `npm install -g @microsoft/rush` 或 `yarn global add @microsoft/rush` 或 `pnpm add -g @microsoft/rush` 安装
- [TypeScript](https://www.typescriptlang.org/): 项目中使用 TypeScript 进行开发
- [Visual Studio Code](https://code.visualstudio.com/): 推荐使用的编辑器,存储库中有专门 VSCode 优化的配置,比如智能提示,测试等,详细配置查看 [.vscode](../.vscode) 文件夹

## Clone repository

```sh
git clone https://github.com/XYShaoKang/video-http-server.git
```

## Build Instructions

```sh
# 安装依赖
rush install
# 构建源码
rush build
# 运行测试
rush test
```

## [TODO] 前端

## [TODO] 命令行

## [TODO] 工作流
