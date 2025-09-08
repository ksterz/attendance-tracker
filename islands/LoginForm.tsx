import { useState } from "preact/hooks";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        const response = await fetch("/api/auth/login", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const message = await response.text();
            alert(message);
        } else {
            location.href = "/";
    }
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                type="email"
                name="email"
                value={email}
                onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                placeholder="Email"
                required
                />
                <input
                type="password"
                name="password"
                value={password}
                onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                placeholder="Password"
                required
                />
                <button type="submit" class="border-2 py-1 px-1">Login</button>
            </form>
        </div>
    )
}