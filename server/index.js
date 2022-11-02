import { consumeMessages } from "./kafka/utils.js";

(async () => {
  console.log("Starting server");
  console.log("FE_TO_BE_TOPIC", process.env.FE_TO_BE_TOPIC);
  console.log("BE_TO_FE_TOPIC", process.env.BE_TO_FE_TOPIC);
  await consumeMessages(process.env.FE_TO_BE_TOPIC);
})();
