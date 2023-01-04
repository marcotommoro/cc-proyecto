import Fastify from "fastify";

import anonymoutsRoutes from "./routes/anonymous";
import authRoutes from "./routes/auth";

// @ts-ignore
import Keycloak from "keycloak-backend";

const fastify = Fastify({
  logger: true,
});

fastify.register(anonymoutsRoutes, { prefix: "/" });
fastify.register(authRoutes, { prefix: "/auth" });

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
  }
});

const keycloak = Keycloak({
  realm: "realm_app",
  keycloak_base_url: "http://keycloak:8080/",
  client_id: "next-app",
  username: "user_app",
  password: "aS4tb3c5gvsC4g9jiwuJ",
  is_legacy_endpoint: false,
});

(async () => {})();
