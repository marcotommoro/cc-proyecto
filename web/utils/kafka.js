import { Kafka, logLevel } from "kafkajs";
let kafka = null;

export const initializeKafka = () => {
  if (kafka !== null) {
    return kafka;
  }
  try {
    kafka = new Kafka({
      clientId: "web",
      brokers: ["broker:9092"],
      logLevel: logLevel.ERROR,
    });
    return kafka;
  } catch (error) {
    kafka = null;
    console.log(error);
  }
};
