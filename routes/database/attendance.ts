import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

export interface IAttendance {
  _id: { $oid: string };
  attendanceId: string;
  userId: string;
  date: string;
}

const client = new MongoClient();
await client.connect(Deno.env.get("MONGO_URI")!);

const db = client.database("test");
const AttendanceCollection = db.collection<IAttendance>("Attendance");

export default { AttendanceCollection };
