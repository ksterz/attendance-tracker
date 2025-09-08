import { Handlers } from "$fresh/server.ts";
import { compare } from "bcryptjs";
import UserCollection from "@database/user.ts"
const User = UserCollection.UserCollection;
import {createSession} from "utils";

export const handler: Handlers = {
  async POST(req) {
    const url = new URL(req.url);
    const form = await req.formData();
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    if (!email || !password) {
      return new Response("Please enter email and password", { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response("User not found", { status: 403 });
    }

    // user existing but passwordHash not existing indicates a previous google sign in
    if (!user.passwordHash) {
      return new Response("Please use Google sign in to login with this email", { status: 403 });
    }

    const valid = await compare(password, user.passwordHash);
    if (!valid) {
      return new Response("Incorrect password", { status: 403 });
    }
    
    return createSession(user, url, "/");
  },
};