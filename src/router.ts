import { FastifyInstance } from "fastify";
import loginController from "./controller/login";
import browserController from "./controller/browser";
import indexController from "./controller";

export default async function router(fastify: FastifyInstance) {
  fastify.register(loginController, { prefix: "/login" });
  fastify.register(browserController, { prefix: "/browser" });
  fastify.register(indexController, { prefix: "/" });
}
