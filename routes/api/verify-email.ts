import { Handlers } from "$fresh/server.ts";
import UserCollection from "@database/user.ts";
const User = UserCollection.UserCollection

export const handler: Handlers = {
    async GET(req) {
        const url = new URL(req.url);
        const token = url.searchParams.get("token");
        
        const user = await User.findOne({ confirmationToken: token });
        if (!user) return new Response("Invalid token", { status: 400 });

        await User.updateOne(
            { _id: user._id },
            { $set: { emailConfirmed: true }, $unset: { confirmationToken: "" } }
        );

        return new Response("Email verified successfully! You may close this window at any time", { status: 200 });
    }
};
