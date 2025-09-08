import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts"; 
// define schema for users
export interface IUser {
  _id: { $oid: string };
  email: string;
  userId: string;
  googleId: string | null;
  name: string;
  fightingName: string | null;
  // attendance logged automatically when signing in if true
  autoLog: boolean;
  passwordHash: string;
  emailConfirmed: boolean;
  confirmationToken: string;
}

const client = new MongoClient();
await client.connect(Deno.env.get("MONGO_URI")!);

const db = client.database("test");
const UserCollection = db.collection<IUser>("User");

export default { UserCollection };