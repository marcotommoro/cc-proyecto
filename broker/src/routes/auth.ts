import { FastifyInstance } from "fastify";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

const routes = async (fastify: FastifyInstance, options: Object) => {
  fastify.get("/getUser", async (request: any, reply: any) => {
    return { hello: "world" };
  });
};

export default routes;
