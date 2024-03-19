import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import axios from 'axios';
import * as WebSocket from 'ws';

export default async function browserController(fastify: FastifyInstance) {
  // GET /browser

  fastify.get('/ws/:id', { websocket: true }, (connection, req) => {
    const path = `ws://0.0.0.0:9222/devtools/page/${req.params['id']}`
    const ws = new WebSocket(path);

    ws.on('message', message => {
      connection.socket.send(message.toString())
    })

    connection.socket.on('message', message => {
      ws.send(message.toString())
    })
  })

  fastify.get("/targets", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const response = await axios.get(`http://0.0.0.0:9222/json`);
    reply.send(response.data);
  });

  fastify.get("/pages", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const response = await axios.get(`http://0.0.0.0:9222/json`);
    reply.send(response.data.filter((item: any) => item.type === 'page'));
  });

  fastify.get("/page", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = request.query as any;
    const response = await axios.get(`http://0.0.0.0:9222/json`);
    reply.send(response.data.filter((item: any) => item.id === id));
  });
}
