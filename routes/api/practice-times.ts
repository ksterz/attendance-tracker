import { Handlers } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import { isAdmin, abbrevDayToEnum, timeStringToNumber, UNKNOWN_ERROR_MESSAGE, PracticeDay, enumToAbbreviatedDay, numberToTimeString } from "utils";
import PracticeTimeCollection from "@database/practice-times.ts";
const PracticeTime = PracticeTimeCollection.PracticeTimeCollection;

export interface SelectedSlot {
  day: string;
  time: string;
}

// length of time slots
const timeInterval = 30;

export const handler: Handlers = {
    async POST(req) {
        const cookies = getCookies(req.headers);
        const sessionToken = cookies.auth;
        if (!isAdmin(sessionToken)) return new Response("You do not have permission to view this page", { status: 403 });
        try {
            const slots: SelectedSlot[] = await req.json();
            // delete practice times previously stored
            PracticeTime.deleteMany({}); 
            for (const slot of slots) {
                const day = abbrevDayToEnum(slot.day);
                const startTime = timeStringToNumber(slot.time)
                const endTime = startTime + timeInterval;
                PracticeTime.insertOne({ day, startTime, endTime });
            }
            return new Response("Practice times have been successfully saved", { status: 200 });
        } catch (error) {
            console.log(error);
            return new Response(UNKNOWN_ERROR_MESSAGE, { status: 500 });
        }
    },
    async GET() {
        try {
            const slots: SelectedSlot[] = [];
            (await PracticeTime.find().toArray()).forEach(function(practiceTime) {
                const day = enumToAbbreviatedDay(practiceTime.day);
                const time = numberToTimeString(practiceTime.startTime);
                slots.push({day, time});
            });
            return new Response(JSON.stringify(slots), { status: 200 });
        } catch (error) {
            return new Response(JSON.stringify({ error }), {
                        status: 500
                        });
        }
    }
};