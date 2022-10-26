import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   axios.get("/api/hello").then((res) => {
  //     setMessage(res.data);
  //     console.log(res.data);
  //   });
  // }, []);

  const handleProduce = async () => {
    axios.get("/api/kafka/produce").then((res) => {
      console.log("hola", res.data);
    });
  };

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

      {/* <button onClick={consumeMessage}>Get message</button> */}
    </div>
  );
}
