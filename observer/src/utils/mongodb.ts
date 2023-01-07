import { Db, MongoClient } from 'mongodb';

let db: Db;

interface SettingsType {
  beforeText: string;
  afterText: string;
  reverse: boolean;
  uppercase: boolean;
}

export const initializeMongo = async () => {
  console.log('Connecting to MongoDB' + process.env.MONGO_URL);

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
    console.log('Cannot initialize Mongodb. Missing MongoDB env variables');

  // @ts-ignore
  const client = new MongoClient(
    `mongodb://${MONGO_USER}:${MONGO_PASSWD}@${MONGO_HOSTNAME}:27017/${MONGO_DB}?${MONGO_PARAMS}`,
  );

  try {
    await client.connect();
    db = client.db(MONGO_DB);
    console.log('Connected to MongoDB');
    retrieveSettings();
  } catch (error) {
    console.log(error);
  }
};

const getMongo = async () => {
  if (!db) {
    await initializeMongo();
  }

  return db;
};

export const retrieveSettings = async (): Promise<SettingsType | null> => {
  try {
    const { MONGO_COLLECTION } = process.env;
    const db = await getMongo();
    if (!db || !MONGO_COLLECTION) return null;

    const collection = db.collection(MONGO_COLLECTION);

    const result = await collection.findOne({ _id: 0 });

    return result as any;
  } catch (error) {
    return null;
  }
};
