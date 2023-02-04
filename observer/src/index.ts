import { Kafka, Producer } from 'kafkajs';
import { initializeMongo, retrieveSettings } from './utils/mongodb';

let kafka: Kafka;
let producer: Producer;

const init = () => {
  try {
    kafka = new Kafka({
      clientId: 'observer',
      brokers: [process.env.KAFKA_BROKER_HOSTNAME],
    });

    producer = kafka.producer();
    producer.connect();
  } catch (error) {
    console.log('Error connecting to Kafka');
    setTimeout(() => {
      init();
    }, 2000);
  }
};

const runListener = async () => {
  try {
    const consumer = kafka.consumer({ groupId: 'observer-consumer' });

    await consumer.connect();
    await consumer.subscribe({
      topic: 'messages-for-observer',
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('Received message');
        console.log({
          value: message.value.toString(),
        });
        sendMessageBack(message.value.toString());
      },
    });
  } catch (error) {
    console.log('Error connecting to Kafka');
    console.log(error);
  }
};

const sendMessageBack = async (message: string) => {
  // message = `Observer edited message: ${message}`;

  const settings = await retrieveSettings();

  if (!settings) return console.log('Cannot retrieve settings from MongoDB');

  if (settings.beforeText) {
    message = `${settings.beforeText} ${message}`;
  }

  if (settings.afterText) {
    message = `${message} ${settings.afterText}`;
  }

  if (settings.uppercase) {
    message = message.toUpperCase();
  }
  if (settings.reverse) {
    message = message.split('').reverse().join('');
  }

  await producer.send({
    topic: 'messages-from-observer',
    messages: [
      {
        value: message,
      },
    ],
  });
};

(async () => {
  init();

  initializeMongo();

  while (!kafka) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  runListener();
})();
