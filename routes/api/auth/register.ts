import { Handlers } from "$fresh/server.ts";
import { hash } from "bcryptjs";
import UserCollection from "@database/user.ts";
const User = UserCollection.UserCollection;
import { sendEmail }from "utils";
import RoleCollection from "@database/role.ts";
const Role = RoleCollection.RoleCollection

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();
    const email = form.get("email")?.toString();
    const name = form.get("name")?.toString();
    const password = form.get("password")?.toString();
    const fightingName = form.get("fightingName")?.toString();
    const autoLog = form.get("autoLog") == "true" ? true : false;

    // Check for potential issues
    if (!email || !name || !password) {
      return new Response("Missing email, name, or password", { status: 400 });
    }

    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      return new Response("Email is being used by another user", { status: 409 });
    }

    // No issues, register account
    const passwordHash = await hash(password, 10);
    // token is used to confirm email
    const confirmationToken = crypto.randomUUID(); 
    const userId = crypto.randomUUID();
    await User.insertOne({ email, userId, name, passwordHash, fightingName, autoLog, emailConfirmed: false, confirmationToken, googleId: null });
    await Role.insertOne({ userId, role: "user" });

    const res = await sendEmail(email, confirmationToken, req);
    if (res.status == 200) {
      return new Response("User registered. Please check your email to confirm your account", { status: 201 });
    }
    return res;
  },
};
