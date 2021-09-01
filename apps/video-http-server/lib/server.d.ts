/// <reference types="koa-bodyparser" />
/// <reference types="node" />
import Koa from 'koa';
import http from 'http';
declare function createApp(rootPath: string): Koa;
declare function createServer(rootPath: string): http.Server;
export { createApp, createServer };
