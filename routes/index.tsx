import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import { getMatchingSlots, getStandardizedTime, isPracticeTime, Data, isBeforePractice, getStandardizedDateString } from "utils";
import SessionCollection from "@database/session.ts";
const Session = SessionCollection.SessionCollection;
import UserCollection from "@database/user.ts";
const User = UserCollection.UserCollection
import RoleCollection from "@database/role.ts";
const Role = RoleCollection.RoleCollection
import AttendanceCollection from "@database/attendance.ts"
const Attendance = AttendanceCollection.AttendanceCollection;
import { handler as attendanceHandler } from "./api/attendance.ts";
import ResendEmail from "../islands/ResendEmail.tsx";
import Layout from "../components/Layout.tsx";
import AttendanceForm from "../islands/AttendanceForm.tsx";


export const handler: Handlers = {
  async GET(req, ctx) {
    const cookies = getCookies(req.headers);
    const sessionToken = cookies.auth;
    let loggedIn = false;
    let name = null;
    let emailConfirmed = false;
    let userId = null;
    let attendanceTracked = false;
    let isAdmin = false;
    let notificationMessage = null;
    const attendanceAutoLoggedMessage = "Your attendance has been automatically logged for today";
    const [today, time] = getStandardizedTime();
    const practiceTimeBool = await isPracticeTime(time, today, req, ctx);
    const matchingSlots = await getMatchingSlots(today, req, ctx);
    if (sessionToken) {
      // check if given session token is valid
      const validSession = await Session.findOne({ sessionToken });
      if (validSession && validSession.userId) {
        const currentUser = await User.findOne({ userId: validSession.userId });
        // currentUser should always exist if session and user are inserted properly and not deleted
        if (currentUser) {
          loggedIn = true;
          name = currentUser.name;
          emailConfirmed = currentUser.emailConfirmed;
          userId = currentUser.userId;
          if (practiceTimeBool) {
            const date = getStandardizedDateString();
            attendanceTracked = await Attendance.findOne({ userId, date }) ? true : false;
            // automatically log attendance when signing in
            if (!attendanceTracked && currentUser.autoLog) {
              const newReq = new Request(req.url, { 
                method: "POST",
                body: JSON.stringify(userId)
              });
              attendanceHandler.POST!(newReq, ctx);
              attendanceTracked = true;
              notificationMessage = attendanceAutoLoggedMessage;
            }
          }
          const userRole = await Role.findOne({ userId });
          // userRole should exist if everything is inserted and deleted correctly
          if (!userRole) {
            return new Response("An unknown error has occurred", { status: 500 })
          }
          if (userRole.role == "admin") isAdmin = true;
        }
      }
    }
    return ctx.render!({ loggedIn, name, emailConfirmed, userId, attendanceTracked, isAdmin, practiceTimeBool, matchingSlots, notificationMessage });
  },
};

export default function Home({ data }: PageProps<Data>) {
  return (
    <Layout data={data}> 
      {data.isAdmin && <AdminHome {...data}/>}
      {!data.isAdmin && 
        <div class="px-4 py-8 max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <AttendanceMessage {...data}/>
        </div>
      }
    </Layout>
  );
}

function AdminHome(data: Data) {
  return (
    <div>
      <div class="topnav">
        <h1 class="active">Home</h1>
        <a href="/attendance-settings"><h1>Attendance Settings</h1></a>
      </div>
      <div class="px-4 py-8 max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <AttendanceMessage {...data}/>
      </div>
    </div>
  );
}

export function HomePageMessage({ loggedIn, emailConfirmed}: Data) {
  if (!loggedIn) {
    return (
      <div>
        Create an account or login above
      </div>
    );
  }
  // logged in but email isn't confirmed
  if (!emailConfirmed) {
    return (
      <div>
        <p class="py-4 small">It appears you have not confirmed your email. Please make sure to do so. You may need to check your spam folder.</p>
        <ResendEmail/>
      </div>
    );
  }
  // no text displayed if logged in and email confirmed
  return null;
}

function AttendanceMessage({ loggedIn, attendanceTracked, userId, practiceTimeBool, matchingSlots }: Data) {
  const startTimeMessage = "Come back later to log your attendance for today";
  const endTimeMessage = "Today's practice is over. Come back next practice!";
  const notPracticeDayMessage = "No practice today. We usually hold practices Wednesdays and Saturdays"
  const attendanceTrackedMessage = "Your attendance for today's practice has been saved";
  const signInMessage = "Sign in to log your attendance for today!";

  const [_today, time] = getStandardizedTime();
  if (matchingSlots && matchingSlots.length !== 0) {
    if (practiceTimeBool) {
      if (loggedIn && !attendanceTracked) {
        return(<AttendanceForm userId={userId}/>);
      } else if (loggedIn && attendanceTracked) {
        return(<p>{attendanceTrackedMessage}</p>);
      }
      return(<p>{signInMessage}</p>);
    } else if (isBeforePractice(time, matchingSlots)) {
      return(<p>{startTimeMessage}</p>);
    }
    // endTimeMessage is also returned in the event that there are gaps between time slots, e.g. it is 7:40 and the 7:00 and 8:00 slots are selected but 7:30 is not
    return(<p>{endTimeMessage}</p>);
  }

  return(<p>{notPracticeDayMessage}</p>);
}
