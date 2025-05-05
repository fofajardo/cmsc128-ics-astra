import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const SUPABASE_URL = process.env.DATABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.DATABASE_ANONYMOUS_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ status: "FAILED", message: "Method not allowed." });
        }

        const { data: users, error: usersError } = await supabase.from("users").select("email");
        if (usersError || !users.length) throw new Error(usersError?.message || "No recipients found.");

        const { data: events, error: eventsError } = await supabase.from("events").select("*").gte("event_date", new Date().toISOString());
        if (eventsError || !events.length) throw new Error(eventsError?.message || "No upcoming events found.");

        const emailHTML = `
            <h2 style="text-align: center;">🚀 Elevate Your Tech Skills & Join Exclusive Events!</h2>
            <p style="font-size: 16px; color: #333;">
                Whether you're a **coding enthusiast**, a **tech visionary**, or just looking to grow your expertise,
                these upcoming events will connect you with **like-minded innovators** and industry leaders.
            </p>
            ${events.map(event => `
                <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0;">
                    <p><strong>🔍 Event ID: ${event.event_id}</strong></p>
                    <p>📅 <strong>Date:</strong> ${event.event_date}</p>
                    <p>📍 <strong>Venue:</strong> ${event.venue}</p>
                    ${event.online ?
                        `<p>🌐 <strong>Join Online:</strong> <a href="${event.access_link}" style="color: #1ABC9C;">Click here</a></p>` :
                        `<p>🔗 <strong>More Info:</strong> <a href="${event.external_link}" style="color: #3498DB;">Click here</a></p>`
                    }
                </div>
            `).join("")}
        `;

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: "Astratech <astratech@gmail.com>",
                to: users.map(user => user.email),
                subject: "💡 Tech Innovators Wanted: Upcoming CS Institute Events!",
                html: emailHTML
            })
        });

        if (!response.ok) throw new Error(`Resend API error: ${await response.text()}`);

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ status: "FAILED", message: error.message });
    }
}
