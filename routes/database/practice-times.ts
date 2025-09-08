import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

export interface IPracticeTime {
  _id: { $oid: string };
  day: number;
  startTime: number;
  endTime: number;
}

const client = new MongoClient();
await client.connect(Deno.env.get("MONGO_URI")!);

const db = client.database("test");
const PracticeTimeCollection = db.collection<IPracticeTime>("PracticeTime");

export default { PracticeTimeCollection };