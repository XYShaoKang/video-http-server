# video-http-server

video-http-server 是一个命令行工具,在任意目录启动一个服务,用以通过浏览器查目录下的视频文件.

[![asciicast](https://asciinema.org/a/NcbE2NzqgN1iYc2v32r4xI9zT.svg)](https://asciinema.org/a/NcbE2NzqgN1iYc2v32r4xI9zT)

## 安装

```
npm install -g video-http-server
# or
yarn global add video-http-server
```

## 使用

```
vhs
# or
video-http-server
```

## 参数

- `--root` 指定浏览的根目录,默认为当前目录`./`,传递相对于当前目录的相对路径
  - `vhs --root=[paht]`
  - `vhs [path]`
- `--port,-p` 指定要监听的端口,默认为`9011`
  - `vhs --port=9000`
- `--host,-h` 指定要使用的 url 或者 ip,默认为`0.0.0.0`
- `--version` 显示版本号
- `--help` 显示帮助信息
