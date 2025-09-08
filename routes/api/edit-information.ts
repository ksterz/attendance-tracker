import { Handlers } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import { getUserId } from "utils";
import UserCollection from "@database/user.ts";
const User = UserCollection.UserCollection

export const handler: Handlers = {
    async POST(req) {
        const form = await req.formData();
        const name = form.get("name")?.toString();
        const fightingName = form.get("fightingName")?.toString();
        const autoLog = form.get("autoLog") == "true" ? true : false;
        const cookies = getCookies(req.headers);
        const sessionToken = cookies.auth;
        const userId = await getUserId(sessionToken);
        if (!userId) {
            return new Response("User not found", { status: 401});
        }
        await User.updateOne({userId}, {$set: {name, fightingName, autoLog}});
        return new Response("Your information has been updated.", { status:200 })
    }
}