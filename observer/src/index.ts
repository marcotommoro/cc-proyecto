import { Kafka, Producer } from "kafkajs";

let kafka: Kafka;
let producer: Producer;

const init = () => {
  kafka = new Kafka({
    clientId: "observer",
    brokers: ["kafka:9092"],
  });

  producer = kafka.producer();
  producer.connect();
};

const runListener = async () => {
  const consumer = kafka.consumer({ groupId: "observer-consumer" });

  await consumer.connect();
  await consumer.subscribe({
    topic: "messages-for-observer",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Received message");
      console.log({
        value: message.value.toString(),
      });
      sendMessageBack(message.value.toString());
    },
  });
};

const sendMessageBack = async (message: string) => {
  message = `Observer edited message: ${message}`;

  await producer.send({
    topic: "messages-from-observer",
    messages: [
      {
        value: message,
      },
    ],
  });
};

init();
runListener();
