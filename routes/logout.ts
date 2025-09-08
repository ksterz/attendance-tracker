import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "std/http/cookie.ts";
import { getCookies } from "std/http/cookie.ts";
import SessionCollection from "./database/session.ts"
const Session = SessionCollection.SessionCollection;

export const handler: Handlers = {
  async GET(req) {
    const headers = new Headers(req.headers);
    const cookies = getCookies(req.headers);
    const sessionToken = cookies.auth;
    await Session.deleteOne({sessionToken});
    // remove session token from cookies
    deleteCookie(headers, "auth", { path: "/", domain: Deno.env.get("DOMAIN") });
    headers.set("location", "/");
    return new Response(null, {
      status: 302,
      headers,
    });
  },
};