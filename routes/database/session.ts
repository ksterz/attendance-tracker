import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

export interface ISession {
  _id: { $oid: string };
  sessionToken: string;
  userId: string;
  expiresAfter: Date;
}

const client = new MongoClient();
await client.connect(Deno.env.get("MONGO_URI")!);

const db = client.database("test");
const SessionCollection = db.collection<ISession>("Session");

export default { SessionCollection };