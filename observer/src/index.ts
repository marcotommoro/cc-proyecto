import { Kafka, Producer } from 'kafkajs';
import { initializeMongo, retrieveSettings } from './utils/mongodb';

let kafka: Kafka;
let producer: Producer;

const init = () => {
  kafka = new Kafka({
    clientId: 'observer',
    brokers: ['kafka:9092'],
  });

  producer = kafka.producer();
  producer.connect();
};

const runListener = async () => {
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

init();
runListener();
initializeMongo();
