import app from "./app";

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 3006;

app.listen({ port: FASTIFY_PORT });

console.log(`🚀  Fastify server running on port ${FASTIFY_PORT}`);
console.log(`Route index: /`);
console.log(`Route browser: browser/pages 查询浏览器中打开的页面`);
console.log(`Route browser: browser/ws/:id 浏览器devtools协议`);
console.log(`Route login: login/detect 检测客户端浏览器相关信息，为跳转做准备`);
console.log(`Route login: login/cast 将服务器浏览器投屏到客户端浏览器 canvas`);
