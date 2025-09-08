import { setCookie } from "std/http/cookie.ts";
import SessionCollection from "@database/session.ts";
const Session = SessionCollection.SessionCollection;
import UserCollection from "@database/user.ts";
const User = UserCollection.UserCollection;
import RoleCollection from "@database/role.ts";
const Role = RoleCollection.RoleCollection;
import { IUser } from "@database/user.ts";
import { handler as practiceTimesHandler, SelectedSlot } from "./routes/api/practice-times.ts";
import { formatAMPM } from "./islands/TimeChart.tsx";
export const UNKNOWN_ERROR_MESSAGE = "An unknown error has occurred";
export const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export class PracticeDay {
  public day: Days;
  public startTime: number;
  public endTime: number;
  public constructor(day: Days, startTime: number, endTime: number) {
    this.day = day;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}

export enum Days {
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
}

// data used in index
export interface Data {
  loggedIn: boolean;
  emailConfirmed: boolean;
  name: string;
  userId: string;
  attendanceTracked: boolean;
  isAdmin: boolean;
  practiceTimeBool: boolean;
  matchingSlots: PracticeDay[];
  notificationMessage: string;
}

// used when a user logs in
export async function createSession(user: IUser, url: URL, destination: string) {
    // Generate a session token
    const sessionToken = crypto.randomUUID();
    // Store token in sessions collection
    await Session.insertOne({
      sessionToken,
      userId: user.userId,
      expiresAfter: new Date()
    });
    const headers = new Headers();
    setCookie(headers, {
      name: "auth",
      value: sessionToken,
      maxAge: 3600, 
      sameSite: "Lax",
      domain: url.hostname,
      path: "/",
      secure: true,
    });

    headers.set("location", destination);
    return new Response(null, {
      status: 302,
      headers,
    });
}

// used when sending/resending verification email
export async function sendEmail(email : string, confirmationToken : string, req : Request) {
  const url = new URL(req.url);
  const baseUrl = url.origin;
  const link = `${baseUrl}/api/verify-email?token=${confirmationToken}`;
  let html = await Deno.readTextFile("routes/email-templates/verify-email.html");
  html = html.replace(/{{link}}/g, link);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get("RESEND_API_KEY")}`
    },
    body: JSON.stringify({
      from: 'no-reply@artraintea.com',
      to: email,
      subject: 'Verify Your Email Address',
      html
    })
  });

  if (res.ok) {
    return new Response("Email has been sent", { status: 200 });
  }

  console.log(res.text);
  return new Response(UNKNOWN_ERROR_MESSAGE, { status:500 });
}

export async function getUserId(sessionToken: string) {
  let userId = null;
  if (sessionToken) {
    const validSession = await Session.findOne({sessionToken});
    if (validSession) {
      const currentUser = await User.findOne({userId: validSession.userId});
      if (currentUser) {
        userId = currentUser.userId;
      }
    }
  }
  return userId;
}

function isInDevelopment() {
  return Deno.env.get("DENO_DEPLOYMENT_ID") == undefined;
}

export async function isAdmin(sessionToken: string) {
  const userId = await getUserId(sessionToken);
  if (userId) {
    const userRole = await Role.findOne({ userId });
    if (userRole && userRole.role == "admin") {
        return true;
    }
  }
  return false;
}

// converts hours to minutes and other time zones to utc
export function timeConverter(hour: number, minute: number, offset: number) {
  return hour*60 + minute - offset;
}

// adjusts dates and times for time zone diffs
export function getStandardizedTime() {
  const now = new Date();
  let today = now.getDay();
  // 300 is offset for cdt (5 hours behind GMT)
  // timezone in development vs deployment is different
  const offset = isInDevelopment() ? 0 : 300;
  let time = timeConverter(now.getHours(), now.getMinutes(), offset);
  // if statement accounts for the case of gmt and current timezone being in different days
  if (time < 0) {
    const minuteInDay = 24*60;
    time += minuteInDay;
    // since sunday = 0 it can't be decremented normally
    if (today == Days.SUNDAY) {
      today = Days.SATURDAY;
    } else {
      today -= 1;
    }
  }
  return [today, time];
}

export function getStandardizedDateString() {
  const preStandardization = new Date();
  const [today, _time] = getStandardizedTime();
  if (today != preStandardization.getDay()) {
    let n = preStandardization.getTime();
    n -= 86400000;
    const newDate = new Date(n);
    return newDate.toDateString();
  }
  return preStandardization.toDateString();
}

export async function isPracticeTime(time: number, today: Days, req: Request, ctx: any) {
  const response = await practiceTimesHandler.GET!(req, ctx);
  if (!response.ok) return false;
  const slots: SelectedSlot[] = await response.json();
  const timeInterval = 30;
  
  if (!slots) return false;
  for (const slot of slots) {
    const day = abbreviatedDayToEnum(slot.day);
    const startTime = timeStringToNumber(slot.time);
    const endTime = startTime + timeInterval;
    if (today === day && time >= startTime && time <= endTime) return true;
  }
  return false;
}

//matchingSlots is slots where the day matches
export function isBeforePractice(time: number, matchingSlots: PracticeDay[]) {
  if (!matchingSlots || matchingSlots.length == 0) return false;
  for (const slot of matchingSlots) {
    if (slot.startTime > time) return true;
  }
  return false;
}

export function timeStringToNumber(time: string) {
  const [hourMin, ampm] = time.trim().split(' ');
  const [hourStr, minStr] = hourMin.split(':');
  let hour = parseInt(hourStr);
  const min = parseInt(minStr);
  if (ampm === "PM" && hour !== 12) {
    hour += 12;
  } else if (ampm === "AM" && hour === 12) {
    hour = 0;
  }
  return 60*hour + min;
}

export function numberToTimeString(convertedTime: number) {
  const hour = Math.floor(convertedTime / 60);
  const minute = convertedTime % 60;
  return formatAMPM(hour, minute);
}

export  function abbreviatedDayToEnum(day: string){
  switch(day) {
    case "Sun":
      return Days.SUNDAY;
    case "Mon":
      return Days.MONDAY;
    case "Tue":
      return Days.TUESDAY;
    case "Wed":
      return Days.WEDNESDAY;
    case "Thu":
      return Days.THURSDAY;
    case "Fri":
      return Days.FRIDAY;
    case "Sat":
      return Days.SATURDAY;
    default:
      throw new Error("Invalid day enum");
  }
} 
export { abbreviatedDayToEnum as abbrevDayToEnum }

// time slots where day matches
export async function getMatchingSlots(today: Days, req: Request, ctx: any) {
  const response = await practiceTimesHandler.GET!(req, ctx);
  if (!response.ok) return null;
  const slots: SelectedSlot[] = await response.json();
  const timeInterval = 30;
  if (!slots) return null;

  const matchingSlots = [];
  for (const slot of slots) {
    const day = abbreviatedDayToEnum(slot.day)
    if (day === today) {
      const startTime = timeStringToNumber(slot.time);
      const endTime = startTime + timeInterval;
      matchingSlots.push(new PracticeDay(day, startTime, endTime));
    }
  }
  return matchingSlots;
}

export function enumToAbbreviatedDay(day: Days) {
  return(days[day]);
}