import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { validateToken } from '../utils/keycloak';
import { uploadFile } from '../utils/minio';
import { setObserverSettings } from '../utils/mongodb';
/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

const routes = async (fastify: FastifyInstance, options: Object) => {
  fastify.addHook('preHandler', async (request, reply) => {
    fastify.log.info('PREHANDLER');
    // @ts-ignore
    request.locals = {};

    if (!request.headers.authorization)
      return reply
        .code(404)
        .send({ error: 'Bad request. Miss authorization bearer token' });

    let user: any;

    try {
      user = await validateToken(request.headers.authorization);
      fastify.log.info(user);
    } catch (error) {
      fastify.log.error('ciao' + error);
      return reply.code(500).send({ error: `Server error: ${error}` });
    }

    if (!user || !user.active) {
      return reply.code(403).send({ error: 'Unauthorized' });
    }

    // @ts-ignore
    request.locals = { user };
  });

  fastify.post(
    '/check-user',
    async (request: FastifyRequest, reply: FastifyReply) => {
      // @ts-ignore
      const { user } = request.locals;
      return reply.code(200).send({ msg: `Hello Mr. ${user.name}` });
    },
  );

  fastify.post(
    '/change-observer-settings',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const {
          uppercase,
          beforeText,
          afterText,
          reverse,
        }: {
          uppercase: boolean;
          beforeText: string;
          afterText: string;
          reverse: boolean;
        } = request.body as any;

        await setObserverSettings({
          uppercase,
          beforeText,
          afterText,
          reverse,
        });
        fastify.log.info('Settings updated');

        return reply.code(200).send({ msg: 'Settings updated' });
      } catch (error) {
        return reply.code(500).send({ error: `Server error: ${error}` });
      }
    },
  );

  fastify.post('/upload-background', async (request: FastifyRequest, reply) => {
    try {
      // @ts-ignore
      const data = await request.file();

      await uploadFile(data);
    } catch (error) {
      console.log(error);
    }
    fastify.log.info('Upload background done');

    return reply.code(200).send({ msg: 'Backgournd' });
  });
};

export default routes;
