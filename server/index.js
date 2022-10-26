const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT;

const kafka = require("./kafka");

app.get("/", async (req, res) => {
  res.send("Express + TypeScript Server");
  const producer = kafka.producer();
  await producer.connect();
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
