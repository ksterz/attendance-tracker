import { Handlers } from "$fresh/server.ts";
import UserCollection from "@database/user.ts";
const User = UserCollection.UserCollection
import AttendanceCollection from "@database/attendance.ts";
import { getStandardizedDateString } from "utils";
const Attendance = AttendanceCollection.AttendanceCollection;

const USER_NOT_FOUND_MESSAGE = "User not found";

export const handler: Handlers = {
  async POST(req) {
    if (!req.body) {
        return new Response("Invalid request", {status: 400});
    }
    const userId = (await req.json()).userId;
    if (!userId) {
      return new Response(USER_NOT_FOUND_MESSAGE, { status: 403 });
    }
    const user = await User.findOne({userId});
    if (!user) {
        return new Response(USER_NOT_FOUND_MESSAGE, { status: 403 });
    }

    const today = getStandardizedDateString();
    const alreadyTracked = await Attendance.findOne({ userId, date: today});
    if (alreadyTracked) {
        return new Response("You have already logged your attendance today.", {status: 409});
    }

    const attendanceId = crypto.randomUUID();
    Attendance.insertOne({userId, attendanceId, date: today});
    googleFormSubmit(user);
    return new Response("Thank you for signing in!", {status: 201});
  },
};

async function googleFormSubmit(user : any) {
  // name used for attendance is the user's fighting name if it is non null, regular name otherwise
  const submissionName = (user.fightingName) ? user.fightingName : user.name;
  const url = "https://docs.google.com/forms/d/e/1FAIpQLSfo5VwdQY6PilI6TqPdlBGXIekoIAAO7YKe48iA4JgjKYCCZw/formResponse";
  const entryTag = "entry.785125536"
  const formData = new FormData();
  formData.append(entryTag, submissionName);
  await fetch(url!, {
    method: "POST",
    body: formData,
  });
}