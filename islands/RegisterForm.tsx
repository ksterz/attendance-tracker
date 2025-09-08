import { useState } from "preact/hooks";

export default function RegisterForm() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [fightingName, setFightingName] = useState("");
    const [autoLog, setAutoLog] = useState(false);
    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("email", email);
        formData.append("name", name);
        formData.append("password", password);
        formData.append("fightingName", fightingName);
        formData.append("autoLog", autoLog.toString());

        const response = await fetch("/api/auth/register", {
            method: "POST",
            body: formData,
        });

        const message = await response.text();
        alert(message);
        if (response.ok) {
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
                type="text"
                name="name"
                value={name}
                onInput={(e) => setName((e.target as HTMLInputElement).value)}
                placeholder="Name"
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
                <div class="tooltip-container">
                    <input
                    type="text"
                    name="fightingName"
                    value={fightingName}
                    onInput={(e) => setFightingName((e.target as HTMLInputElement).value)}
                    placeholder="&quot;Fighting&quot; Name"
                    />
                    <span class="tooltip-text">Your fighting name is used for attendance purposes. If left blank, we will use the name input above. You can edit this at any time.</span>
                </div>
                <div>
                    <input
                    type="checkbox"
                    name="autoLog"
                    onInput={(e) => setAutoLog((e.target as HTMLInputElement).checked)}/>
                    <label for="autoLog" class="px-2">Automatically log attendance when signing in</label>
                </div>
                <button type="submit" class="border-2 px-1 py-1">Register</button>
            </form>
        </div>
    )
}
