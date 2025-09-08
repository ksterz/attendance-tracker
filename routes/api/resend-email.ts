import { Handlers } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import SessionCollection from "@database/session.ts";
const Session = SessionCollection.SessionCollection;
import UserCollection from "@database/user.ts";
const User = UserCollection.UserCollection
import {sendEmail} from "utils";

export const handler: Handlers = {
  async GET(req) {
    const cookies = getCookies(req.headers);
    const sessionToken = cookies.auth;
    const session = await Session.findOne({ sessionToken });
    if (!session) {
      return new Response("Invalid session.", { status: 401 });
    }
    const user = await User.findOne({ userId: session.userId });
    // user should always exist if session and user are inserted properly and not deleted
    if (user) {
      const res = await sendEmail(user.email, user.confirmationToken, req);
      if (res.status == 200) {
        return new Response("A new email has been sent.", { status: 200 });
      } 
      return res
    }
    return new Response("Could not find user.", { status: 403 });
  },
};