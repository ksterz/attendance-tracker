import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import SessionCollection from "@database/session.ts";
const Session = SessionCollection.SessionCollection;
import UserCollection from "@database/user.ts";
const User = UserCollection.UserCollection
import { Data } from "../islands/SettingsForm.tsx"
import SettingsForm from "../islands/SettingsForm.tsx";


export const handler: Handlers = {
    async GET(req, ctx) {
        const cookies = getCookies(req.headers);
        const sessionToken = cookies.auth;
        if (sessionToken) {
            const validSession = await Session.findOne({ sessionToken });
            if (validSession) {
                const currentUser = await User.findOne({ userId: validSession.userId });
                if (currentUser) {
                    const name = currentUser.name;
                    const fightingName = currentUser.fightingName != "undefined" ? currentUser.fightingName : null;
                    const autoLog = currentUser.autoLog;
                    return ctx.render!({ name, fightingName, autoLog });
                }
            }
        }
        return new Response("Please sign in to view settings", { status: 401 });
    },
}

export default function Settings({ data }: PageProps<Data>) {
    return (
        <div class="px-4 py-8 mx-auto max-w-screen-md mx-auto flex flex-col items-center justify-center">
            <h1 class="text-2xl" style="padding-bottom: 1rem;">Settings</h1>
            <SettingsForm {...data}/>
            <p class="py-4">Note that if your fighting name is left blank, your regular name will be used for attendance.</p>
        </div>
    );
}