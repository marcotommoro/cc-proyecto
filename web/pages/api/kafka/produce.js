import { Kafka, Partitioners } from "kafkajs";

const initializeKafka = () => {
  try {
    const kafka = new Kafka({
      clientId: "web",
      brokers: ["broker:9092"],
    });
    console.log("ciao", kafka);
    return kafka;
  } catch (error) {
    console.log(error);
  }
};

const produceMessage = async (kafka, message) => {
  if (!kafka) return;

  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });

  await producer.connect();
  await producer.send({
    topic: process.env.CONSUMER_TOPIC,
    messages: [{ value: message }],
  });
};

export default async function handler(req, res) {
  const {
    method,
    body: { message },
  } = req;

  if (method !== "POST") return res.status(403).json({ message: "Forbidden" });

  const kafka = initializeKafka();

  try {
    await produceMessage(kafka, message);

    res.status(200).json({ name: `Hello ${message}` });
  } catch (error) {
    console.log(error);
    res.status(200).json({ name: "fuck" });
  }
}
