import { createIndexes } from "lib/createIndexes";

export default async function handler(req, res) {
  try {
    await createIndexes();
    console.log("Indexes created successfully");
    res.status(200).json({ message: "Indexes created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating indexes" });
  }
}
