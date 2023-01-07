import { FastifyInstance } from 'fastify';
import { Db, MongoClient } from 'mongodb';

let db: Db;

export const initializeMongo = async (fastify: FastifyInstance | undefined) => {
  if (fastify)
    fastify.log.info('Connecting to MongoDB' + process.env.MONGO_URL);

  const {
    MONGO_PARAMS,
    MONGO_USER,
    MONGO_PASSWD,
    MONGO_HOSTNAME,
    MONGO_DB,
    MONGO_COLLECTION,
  } = process.env;

  if (
    !MONGO_USER ||
    !MONGO_PASSWD ||
    !MONGO_HOSTNAME ||
    !MONGO_DB ||
    !MONGO_COLLECTION
  )
    fastify?.log.error(
      'Cannot initialize Mongodb. Missing MongoDB env variables',
    );

  // @ts-ignore
  const client = new MongoClient(
    `mongodb://${MONGO_USER}:${MONGO_PASSWD}@${MONGO_HOSTNAME}:27017/${MONGO_DB}?${MONGO_PARAMS}`,
  );

  try {
    await client.connect();
    const _db = client.db(MONGO_DB);
    if (fastify) fastify.log.info('Connected to MongoDB');

    db = _db;
  } catch (error) {
    console.log(error);
  }
};

const getMongo = async (fastify: FastifyInstance | undefined) => {
  if (!db) {
    await initializeMongo(fastify);
  }

  return db;
};

export const getObserverSettings = async () => {
  try {
    const { MONGO_COLLECTION } = process.env;
    const db = await getMongo(undefined);
    if (!db || !MONGO_COLLECTION) return null;

    const collection = db.collection(MONGO_COLLECTION);

    const data = await collection.findOne({});
    return;
  } catch (error) {
    return null;
  }
};

export const setObserverSettings = async (settings: any) => {
  try {
    const { MONGO_COLLECTION } = process.env;
    const db = await getMongo(undefined);
    if (!db || !MONGO_COLLECTION) return null;

    const collection = db.collection(MONGO_COLLECTION);

    return collection.updateOne(
      { _id: 0 },
      { $set: settings },
      { upsert: true },
    );
  } catch (error) {
    return null;
  }
};
