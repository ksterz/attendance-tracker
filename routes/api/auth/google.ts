import { Handlers } from "$fresh/server.ts";
import { OAuth2Client } from "google-auth-library";
import { getCookies } from "std/http/cookie.ts";
import UserCollection from "@database/user.ts";
const User = UserCollection.UserCollection
import {createSession} from "utils";
import RoleCollection from "@database/role.ts";
const Role = RoleCollection.RoleCollection

export const handler: Handlers = {
    async POST(req) {
        try {
            const url = new URL(req.url);
            const cookies = getCookies(req.headers);
            const form = await req.formData();
            // CSRF double submit check
            const csrfTokenCookie = cookies["g_csrf_token"];
            const csrfTokenBody = form.get("g_csrf_token");
            if (!csrfTokenCookie || !csrfTokenBody || csrfTokenCookie !== csrfTokenBody) {
                return new Response("Issue encountered verifying CSRF token", { status: 400 });
            }
            // get google id token
            const token = form.get("credential");
            if (!token || typeof token !== "string") {
                return new Response("Missing token", { status: 400 });
            }
            // verify google id token
            const client = new OAuth2Client;
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: Deno.env.get("GOOGLE_CLIENT_ID"),
            });
            const payload = ticket.getPayload();
            if (!payload) {
                throw new Error("Empty payload");
            }
            // google id verified, get user info
            const googleId = payload['sub'];
            const existingUser = await User.findOne({ googleId });
            if (existingUser) {
                return createSession(existingUser, url, "/");
            }
            // check if a user with this email already signed up with the email registration system, fail verification if they do
            // change later if linking the accounts or another method is preferred
            const email = payload['email'];
            const nonGoogleUser = await User.findOne({ email });
            if (nonGoogleUser) {
                return new Response("An account with this email already exists. Please login using your email and password rather than Google sign in.",
                                    { status: 401 });
            }
            // create new user entry in database table
            const userId = crypto.randomUUID();
            const name = payload['name'];
            await User.insertOne({userId, email, name, googleId, emailConfirmed: true});
            const newUser = await User.findOne({ userId });
            await Role.insertOne({ userId, role: "user" });
            return createSession(newUser, url, "/google-supplement");
        } catch (error) {
            console.error('Google verification failed: ', error);
            return new Response("Invalid token", { status: 401 });
        }
    }
}