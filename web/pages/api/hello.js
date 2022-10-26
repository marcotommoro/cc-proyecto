// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Kafka, Partitioners } from "kafkajs";


const initializeKafka = () => {
  try {
    const kafka = new Kafka({
      clientId: "web",
      brokers: ["kafka:9092"],
    });
    setKafka(kafka);
    console.log("ciao", kafka);
  } catch (error) {
    console.log(error);
  }
}


const produceMessage = async () => {
  if (message.lenght === 0 || !kafka) return;

  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });

  try {
    await producer.connect();
    await producer.send({
      topic: "test-topic",
      messages: [{ value: message }],
    });
  } catch (error) {
    console.error(error);
  }
};


const consumeMessage = async () => {
  if (!kafka) return;

  const consumer = kafka.consumer({ groupId: "test-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
    },
  });
};

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
