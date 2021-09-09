# 维护指南

## 先决条件

- [Git](https://git-scm.com/)
- [Node](https://nodejs.org/): 开发环境使用`Node.js v14.16.0`,其他版本暂未测试
- [pnpm](https://pnpm.io): 包管理工具
  - [pnpm installation](https://pnpm.io/installation) 查看文档安装
- [Rush](https://github.com/Microsoft/web-build-tools/wiki/Rush): 使用 `npm install -g @microsoft/rush` 或 `yarn global add @microsoft/rush` 或 `pnpm add -g @microsoft/rush` 安装
- [TypeScript](https://www.typescriptlang.org/): 项目中使用 TypeScript 进行开发
- [Visual Studio Code](https://code.visualstudio.com/): 推荐使用的编辑器,仓库中有专门 VSCode 优化的配置,比如智能提示,测试等,详细配置查看 [.vscode](../.vscode) 文件夹

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

## 前端开发模式

```sh
cd apps/front-end
```

进入前端项目文件夹

```sh
rushx dev
```

运行开发模式,开发模式会使用 video-http-server 启动一个服务,以`./static`(既`apps/front-end/static`)作为根目录,其中有个`demo.mp4`作为演示用.

然后使用 Webpack 启动一个开发服务器,并使用`proxy`将 API 代理到上面启动的服务,详细查看 [development.mjs](../apps/front-end/config/development.mjs).

开发模式默认启用了[Fast Refresh](https://github.com/facebook/react/issues/16604#issuecomment-528663101),也就是热加载.

## 命令行开发模式

```sh
cd apps/video-http-server
```

进入前端项目文件夹

```sh
rushx dev
```

运行开发模式,会将前端构建结果,也就是`apps/front-end/dist/`下的文件复制到`apps/video-http-server/public/`下作为命令行服务的前端,并使用`ts-node-dev`启动服务,以`../front-end/static`(既`apps/front-end/static`)作为根目录.

## [TODO] 工作流
