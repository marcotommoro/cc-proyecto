import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "worker",
  brokers: ["broker:9092"],
});

export const consumeMessages = async (topic) => {
  console.log("ciao finocchi", topic);
  try {
    const consumer = kafka.consumer({
      groupId: "consumer-group",
    });
    await consumer.connect({});
    await consumer.subscribe({ topics: ["fe-to-be-topic"] });

    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        console.log("FFORIO");
        console.log(topic, message.value.toString());
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const produceMessages = async (topic, producer) => {};
