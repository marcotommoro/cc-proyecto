import fs from "fs";

const readFirstLineAndDelete = () => {
  const data = fs.readFileSync("data.txt", "utf8");
  const lines = data.split("\n");
  const firstLine = lines[0];
  const restOfLines = lines.slice(1).join("\n");
  fs.writeFileSync("data.txt", restOfLines);
  return firstLine;
};

export default function handler(req, res) {
  res.status(200).json({ message: readFirstLineAndDelete() });
}
