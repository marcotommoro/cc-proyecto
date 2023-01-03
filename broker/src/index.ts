import Fastify from "fastify";

import anonymoutsRoutes from "./routes/anonymous";

const fastify = Fastify({
  logger: true,
});

fastify.register(anonymoutsRoutes, { prefix: "/" });

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
  }
});
