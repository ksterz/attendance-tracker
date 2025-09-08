export default function ResendEmail() {
    const sendEmail = async (e: Event) => {
        e.preventDefault();
        const response = await fetch("/api/resend-email", {
            method: "GET",
        });

        const message = await response.text();
        alert(message);
        if (response.ok) {
            location.href = "/";
        }
    }
    return (
        <div class="font-bold">
            <button type="submit" onClick={sendEmail}>
                Click here if you would like to request another email
            </button>
        </div>
    )
}