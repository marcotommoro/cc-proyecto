import cors from '@fastify/cors';
import Fastify from 'fastify';
import anonymoutsRoutes from './routes/anonymous';
import authRoutes from './routes/auth';

import { initializeMongo } from './utils/mongodb';

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {});
fastify.register(anonymoutsRoutes);
fastify.register(authRoutes, { prefix: '/auth' });

// Run the server!
fastify.listen({ port: 5001, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
  fastify.log.info('ciao' + process.env.KEYCLOAK_HOSTNAME_PORT);

  initializeMongo(fastify);
});
