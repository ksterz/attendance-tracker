import RegisterForm from "../islands/RegisterForm.tsx";
import { GoogleSignUpButton } from "../islands/GoogleAuthButtons.tsx";

export default function Register() {
    return (
        <div class="px-4 py-8 mx-auto max-w-screen-md mx-auto flex flex-col items-center justify-center">
            <h1 class="text-2xl">Register</h1>
            <p class="py-4">Fill in your email, name, and password to register an account</p>
            <RegisterForm />
            <p class="py-4">You can also register using your Google account.</p>
            <GoogleSignUpButton/>
        </div>
    );
}