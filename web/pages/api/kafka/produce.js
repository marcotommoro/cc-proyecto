import { Kafka } from "kafkajs";

const initializeKafka = () => {
  try {
    const kafka = new Kafka({
      clientId: "web",
      brokers: ["broker:9092", "localhost:9092"],
    });
    console.log("ciao", kafka);
    return kafka;
  } catch (error) {
    console.log(error);
  }
};

const produceMessage = async (kafka) => {
  if (!kafka) return;

  //   const producer = kafka.producer({
  //     createPartitioner: Partitioners.LegacyPartitioner,
  //   });

  try {
    const producer = kafka.producer();

    await producer.connect();
    // await producer.send({
    //   topic: "test-topic",
    //   messages: [{ value: "Hola tio!" }],
    // });
  } catch (error) {
    console.error("conooo", error);
  }
};

export default async function handler(req, res) {
  const kafka = initializeKafka();
  await produceMessage(kafka);

  res.status(200).json({ name: "John Doe" });
}
