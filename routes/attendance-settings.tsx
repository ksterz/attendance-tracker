import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import { getUserId, isAdmin, UNKNOWN_ERROR_MESSAGE } from "utils";
import Layout from "../components/Layout.tsx";
import UserCollection from "@database/user.ts";
const User = UserCollection.UserCollection
import TimeChart from "../islands/TimeChart.tsx";
import { Data } from "utils";
export const handler: Handlers = {
    async GET(req, ctx) {
        const cookies = getCookies(req.headers);
        const sessionToken = cookies.auth;
        if (!(await isAdmin(sessionToken))) return new Response("You do not have permission to view this page. If you are an admin, please login again.", { status: 403 });

        const userId = await getUserId(sessionToken);
        if (!userId) return new Response(UNKNOWN_ERROR_MESSAGE, { status: 500 });
        const user = await User.findOne({ userId });
        return ctx.render!({ loggedIn: true, emailConfirmed: user!.emailConfirmed, name: user!.name });
    }
}

export default function AttendanceSettings({ data }: PageProps<Data>) {
    return (
        <Layout data={data}>
            <div>
                <div class="topnav">
                    <a href="/"><h1>Home</h1></a>
                    <h1 class="active">Attendance Settings</h1>
                </div>
                <div class="px-4 py-8 max-w-screen-md mx-auto flex flex-col items-center justify-center">
                    <p style="padding-bottom: 1rem">Fill in the chart below to determine when users can log their attendance</p>
                    <TimeChart/>
                </div>
            </div>  
        </Layout>
    );
}