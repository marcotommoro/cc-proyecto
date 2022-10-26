import dotenv from "dotenv";
import { consumeMessages } from "./kafka/utils.js";
dotenv.config();

// const app = express();

// app.get("/", async (req, res) => {
//   const producer = kafka.producer({
//     createPartitioner: Partitioners.LegacyPartitioner,
//   });
//   await producer.connect();
//   const resss = await producer.send({
//     topic: "test-topic",
//     messages: [
//       {
//         value: "Hello KafkaJS user!",
//       },
//     ],
//   });

//   console.log(`Sent successfully ${resss.values}`);
//   res.send("Sent!");
// });

// app.listen(port, () => {
//   console.log(`[server]: Server is running at https://localhost:${port}`);
// });

(async () => {
  await consumeMessages(process.env.CONSUMER_TOPIC);
})();
