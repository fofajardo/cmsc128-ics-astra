import { applyFilter } from "../utils/applyFilter";

const fetchEvents = async (supabase, filters) => {
    let query = supabase
        .from("events")
        .select("*");

    query = applyFilter(query, filters,{
        ilike: ["venue"],
        range: {
            event_date: [filters.event_date_from,filters.event_date_to]
        },
        sortBy: "event_date",
        defaultOrder: "",
        specialKeys: [
            "event_date_from",
            "event_date_from"
        ]
    });

    return await query;
};

const fetchEventById = async (supabase, eventId) => {
    return await supabase
        .from("events")
        .select("*")
        .eq("event_id", eventId)
        .single();
};

const checkExistingEvent = async (supabase, event_date, venue) => {
    const parsedDate = new Date(event_date);
    return await supabase
        .from("events")
        .select()
        .match({ event_date: parsedDate.toISOString(), venue: venue });
};
const checkExistingEventById = async (supabase, eventId) => {
    return await supabase
        .from("events")
        .select()
        .eq("event_id", eventId);
};

const insertEvent = async (supabase, eventData) => {
    return await supabase
        .from("events")
        .insert(eventData)
        .select("event_id");
};

const findEvent = async (supabase, eventId) => {
    return await supabase
        .from("events")
        .select("*")
        .eq("event_id", eventId)
        .single();
};

const updateEventData = async (supabase, eventId, updateData) => {
    return await supabase
        .from("events")
        .update(updateData)
        .eq("event_id", eventId);
};

const deleteEvent = async (supabase, eventId) => {
    return await supabase
        .from("events")
        .delete()
        .eq("event_id", eventId);
};

const eventsService = {
    fetchEvents,
    fetchEventById,
    checkExistingEvent,
    checkExistingEventById,
    insertEvent,
    findEvent,
    updateEventData,
    deleteEvent
};

export default eventsService;
