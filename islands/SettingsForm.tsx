import { useState } from "preact/hooks/";

export interface Data {
    name: string;
    fightingName: string;
    autoLog: boolean;
}
export default function SettingsForm( {name, fightingName, autoLog} : Data) {
    const [updatedName, setName] = useState(name);
    const [updatedFightingName, setFightingName] = useState(fightingName);
    const [updatedAutoLog, setAutoLog] = useState(autoLog);
    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", updatedName);
        formData.append("fightingName", updatedFightingName);
        formData.append("autoLog", updatedAutoLog.toString());

        const response = await fetch("/api/edit-information", {
            method: "POST",
            body: formData,
        });

        const message = await response.text();
        alert(message);
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label for="name" class="px-2">Name:</label><br/>
                    <input
                    type="text"
                    name="name"
                    value={updatedName}
                    onInput={(e) => setName((e.target as HTMLInputElement).value)}
                    placeholder="Name"
                    required
                    class="border-2"
                    />
                </div>
                <div>
                    <label for="fightingName" class="px-2">Fighting name: </label><br/>
                    <input
                    type="text"
                    name="fightingName"
                    value={updatedFightingName}
                    onInput={(e) => setFightingName((e.target as HTMLInputElement).value)}
                    placeholder="&quot;Fighting&quot; Name"
                    class="border-2"
                    />
                </div>
                <div>
                    <input
                    type="checkbox"
                    name="autoLog"
                    onInput={(e) => setAutoLog((e.target as HTMLInputElement).checked)}
                    checked={autoLog}
                    />
                    <label for="autoLog" class="px-2">Automatically log attendance when signing in</label>
                </div>
                <button type="submit" class="border-2 px-1 py-1">Save changes</button>     
            </form>
        </div>
    );
}