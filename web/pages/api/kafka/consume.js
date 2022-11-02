import { initializeKafka } from "@utils/kafka";
import fs from "fs";

const appendToFileSync = (string) => {
  fs.appendFileSync("data.txt", string + "\n");
};

let consumer = undefined;
let current_topic = undefined;
const kafka = initializeKafka();

const consumeMessage = async (topic) => {
  try {
    if (topic === current_topic) {
      console.log("same topic, skip");
      return;
    }
    const initialTime = Date.now();

    console.log("TOPICS", topic, current_topic);

    if (!!consumer) {
      const c = await consumer.disconnect();
      const a = await consumer.stop();
      const b = await consumer.disconnect();

      console.log("A", a, "B", b, "C", c);
    }

    consumer = kafka.consumer({
      groupId: `consumer-web-group`,
      // sessionTimeout: 1000,
      // heartbeatInterval: 500,
    });

    await consumer.connect();
    await consumer.subscribe({ topics: [topic] });

    let result = null;

    await consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
        heartbeat,
        pause,
        stop,
      }) => {
        result = message.value.toString();
        console.log("Partition - topic", partition, topic, result);
        if (!!result) {
          appendToFileSync(result);
        }
      },
    });

    if (result !== null) {
      consumer.commitOffsets([{ topic: topic, partition: 0, offset: "1" }]);
    }

    // consumer.disconnect();
    return;
  } catch (error) {
    console.error(error);
  }
};

export default async function handler(req, res) {
  const {
    method,
    query: { topic },
  } = req;

  if (method !== "GET") return res.status(403).json({ message: "Forbidden" });

  try {
    const message = await consumeMessage(topic);
    res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    res.status(200).json({ name: "fuck" });
  }
}
