import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

export interface IRole {
  _id: { $oid: string };
  userId: string;
  role: string;
}

const client = new MongoClient();
await client.connect(Deno.env.get("MONGO_URI")!);

const db = client.database("test");
const RoleCollection = db.collection<IRole>("Role");

export default { RoleCollection };