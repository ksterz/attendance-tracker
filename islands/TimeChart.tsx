import { useState, useEffect } from "preact/hooks";
import { SelectedSlot } from "../routes/api/practice-times.ts"; 

export function formatAMPM(hour: number, minute: number) {
    let h = hour % 12;
    h = h === 0 ? 12 : h;
    const ampm = hour < 12 ? "AM" : "PM";
    const minStr = minute.toString().padStart(2, "0");
    return `${h}:${minStr} ${ampm}`;
}

function generateTimes(startHour: number, endHour: number) {
    const times: string[] = [];
    const interval = 30; //half hour intervals
    for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += interval) {
            times.push(formatAMPM(h, m));
        }
    }
    return times;
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TimeGrid() {
    const times = generateTimes(9, 22); // 9am-10pm can be generalized later
    const [selected, setSelected] = useState<Record<string, Record<string, boolean>>>({});
    useEffect(() => {
        loadPreviousSelection();
    }, []);

    async function loadPreviousSelection() {
        const response = await fetch("/api/practice-times");
        if (!response.ok) return;

        const slots: SelectedSlot[] = await response.json();

        const newSelected: Record<string, Record<string, boolean>> = {};

        for (const slot of slots) {
            if (!newSelected[slot.day]) newSelected[slot.day] = {};
            newSelected[slot.day][slot.time] = true;
        }

        setSelected(newSelected);
    }

    function resetSelection() {
        setSelected({});
    }

    async function submitSelection() {
        const selectedSlots = [];
        for (const day in selected) {
            for (const time in selected[day]) {
                if (selected[day][time]) {
                    selectedSlots.push({day, time});
                }
            }
        }
        const response = await fetch("/api/practice-times", {
            method: "POST",
            body: JSON.stringify(selectedSlots),
        });
        alert(await response.text());
    }

    function toggle(day: string, time: string) {
        setSelected((prev) => ({
        ...prev,
        [day]: {
            ...prev[day],
            [time]: !prev[day]?.[time],
        },
        }));
    }

    return (
        <div>
            <table class="timechart">
            <thead>
                <tr>
                <th>Time</th>
                {days.map((day) => <th key={day}>{day}</th>)}
                </tr>
            </thead>
            <tbody>
                {times.map((time) => (
                <tr key={time}>
                    <td class="times">{time}</td>
                    {days.map((day) => (
                    <td
                        key={day}
                        className={selected[day]?.[time] ? "selected slot" : "slot"}
                        style={{
                        background: selected[day]?.[time] ? "#4caf50" : "#f0f0f0",
                        cursor: "pointer",
                        }}
                        onClick={() => toggle(day, time)}
                    />
                    ))}
                </tr>
                ))}
            </tbody>
            </table><br/>
            <button type="reset" onClick={resetSelection} class="border-2 px-2">Clear</button>
            <button type="reset" onClick={loadPreviousSelection} class="border-2 px-2">Revert to previous schedule</button>
            <button type="submit" onClick={submitSelection} class="border-2 px-2">Submit</button><br/><br/>
            <p>Note that entries in the "Time" column mark the beginning of the time slot and that each slot lasts 30 minutes, e.g. if you select the "9:30" time slot users are able to sign in from 9:30-10:00</p>
        </div>
    );
}