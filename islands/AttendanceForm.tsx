export default function AttendanceForm({userId} : {userId: string}) {
    const todayDate = new Date().toDateString();
    return(
        <div>
            <h4 class="text-lg">Would you like to log your attendance for today's practice?</h4>
            <p style="color: grey;">{todayDate}</p><br/>
            <button type="button" class="px-2 flex mx-auto items-center justify-center border-2" onClick={() => trackAttendance(userId)}>Yes</button>
        </div>
    );
    async function trackAttendance(userId : string) {
        const response = await fetch("/api/attendance", {
            method: "POST",
            body: JSON.stringify({ userId })
        });
        const message = await response.text();
        alert(message);
        // reload page to remove attendance widget
        if (response.status == 201) {
            location.href="/"
        }
        return response;
    }
}