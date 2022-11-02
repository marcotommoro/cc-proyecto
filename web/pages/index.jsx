import { BE_TO_FE_TOPIC } from "@env";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("bella zio");
  const [receivdMessage, setReceivedMessage] = useState("");
  const [consumerTopic, setConsumerTopic] = useState(BE_TO_FE_TOPIC);

  useEffect(() => {
    console.log("consumerTopic", consumerTopic);
    axios
      .get("/api/kafka/consume", { params: { topic: consumerTopic } })
      .then((res) => {
        console.log("risposta", res.data.message);
        setReceivedMessage(res.data.message);
      });
  }, [consumerTopic]);

  const handleRequestSingleMessage = async () => {
    const response = await axios.get("/api/message");
    console.log("response", response.data);
    setReceivedMessage(response.data.message);
  };

  const handleProduce = async () => {
    axios.post("/api/kafka/produce", { message }).then((res) => {
      console.log("hola", res.data);
    });
  };

  const handleConsume = async () => {};

  return (
    <div>
      <h1>HOLA!</h1>
      <p>Add your message.</p>
      <input
        type="text"
        placeholder="your message"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleProduce}>Send</button>
      <br />
      <br />
      <br />
      <p>Consumer</p>
      <input
        type="text"
        value={consumerTopic}
        onChange={() => {}}
        placeholder="Insert topic"
      />
      <button onClick={handleRequestSingleMessage}>Get message</button>
      <div>{receivdMessage}</div>
    </div>
  );
}
