import Fastify from "fastify";
import websocketPlugin from '@fastify/websocket';
import postgresPlugin from '@fastify/postgres';

import router from "./router";
import browserPlugin from './plugin/browser';
import * as dotenv from 'dotenv';
dotenv.config()

const fastify = Fastify({
  // Logger only for production
  logger: !!(process.env.NODE_ENV !== "development"),
});

// 在本地见一个 .env 文件，写入 connectionString
const dbUrl = process.env.DB;

fastify.register(postgresPlugin, {
  connectionString: dbUrl
})

fastify.register(browserPlugin)
fastify.register(websocketPlugin)
fastify.register(router);

export default fastify;
