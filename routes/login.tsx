import LoginForm from "../islands/LoginForm.tsx";
import { GoogleSignInButton } from "../islands/GoogleAuthButtons.tsx";

export default function Login() {
    return (
        <div class="px-4 py-8 mx-auto max-w-screen-md mx-auto flex flex-col items-center justify-center">
            <h1 class="text-2xl">Login</h1>
            <p class="py-4">Enter your email and password to login</p>
            <LoginForm />
            <p class="py-4">Or sign in with your Google account</p>
            <GoogleSignInButton/>
        </div>
    );
}