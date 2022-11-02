import { Kafka, Partitioners } from "kafkajs";

const kafka = new Kafka({
  clientId: "worker",
  brokers: ["broker:9092"],
});

export const consumeMessages = async (topic) => {
  console.log("Consuming messages...");
  console.log("Topic: ", topic);
  try {
    const consumer = kafka.consumer({
      groupId: "consumer-worker-group",
    });

    await consumer.connect({});
    await consumer.subscribe({ topics: [topic] });
    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        console.log(topic, message.value.toString());
        produceMessages(process.env.BE_TO_FE_TOPIC, message.value.toString());
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const produceMessages = async (topic, message) => {
  console.log("Producing messages...");
  console.log("Topic: ", topic);
  console.log("Message: ", message);
  try {
    const producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    await producer.connect();
    const res = await producer.send({
      topic: topic,
      messages: [
        {
          value: `MENSAJE EDITADO  ${message}`,
        },
      ],
    });
    console.log(`Sent successfully ${res}`);
  } catch (error) {
    console.error(error);
  }
};
