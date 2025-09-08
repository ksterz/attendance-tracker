// this page lets google users add extra info eg fighting name
import { getCookies } from "std/http/cookie.ts";
import { Handlers } from "$fresh/server.ts";
import { getUserId } from "utils";
import UserCollection from "@database/user.ts";
const User = UserCollection.UserCollection


export const handler: Handlers = {
  async GET(req, ctx) {
    const cookies = getCookies(req.headers);
    const sessionToken = cookies.auth;
    const userId = await getUserId(sessionToken);
    if (!userId) {
        return new Response("Unable to find user", {status: 401});
    }
    return ctx.render!();
  },
  async POST(req) {
    const cookies = getCookies(req.headers);
    const sessionToken = cookies.auth;
    const userId = await getUserId(sessionToken);
    if (!userId) {
      return new Response("Unable to find user", {status: 401});
    }

    const form = await req.formData();
    const fightingName = form.get("fightingName") as string;
    const autoLog = form.get("autoLog") ? true : false;
    await User.updateOne({userId}, {$set: {fightingName, autoLog}});
    const headers = new Headers();
    // redirect to home page
    headers.set("location", "/")
    return new Response(null, {
      status: 302,
      headers
    });
  }
};

export default function Home() {
    return (
        <div class="px-4 py-8 mx-auto max-w-screen-md mx-auto flex flex-col items-center justify-center">
            <h1 class="text-2xl">Additional Information</h1>
            <form method="POST" class="py-4 flex flex-col">
                <div class="tooltip-container py-4">
                    <input
                    type="text"
                    name="fightingName"
                    placeholder="&quot;Fighting&quot; Name"
                    />
                    <span class="tooltip-text"> Your fighting name is used for attendance purposes. If left blank, we will use the name associated with your Google account. You can edit this at any time.</span>
                </div>
                <div class="mb-8">
                    <input
                    type="checkbox"
                    name="autoLog"/>
                    <label for="autoLog" class="px-2">Automatically log attendance when signing in</label>
                </div>
                <button type="submit" class="border-2">Submit</button>
            </form>
        </div>
    );
}