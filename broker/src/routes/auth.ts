import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { validateToken } from "../utils/keycloak";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

const routes = async (fastify: FastifyInstance, options: Object) => {
  fastify.post(
    "/check-user",
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (!request.headers.authorization)
        return reply
          .code(404)
          .send({ error: "Bad request. Miss authorization bearer token" });

      let user: any;

      try {
        user = await validateToken(request.headers.authorization);
        fastify.log.info(user);
      } catch (error) {
        fastify.log.error("ciao" + error);
        return reply.code(500).send({ error: `Server error: ${error}` });
      }

      if (!user || !user.active) {
        return reply.code(403).send({ error: "Unauthorized" });
      }

      return reply.code(200).send({ msg: `Hello Mr. ${user.name}` });
    }
  );
};

export default routes;
