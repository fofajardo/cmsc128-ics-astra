const searchEvents = (events, searchQuery) => {
  if (!searchQuery) return events;

  const query = searchQuery.toLowerCase();
  return events.filter(event =>
    event.title?.toLowerCase().includes(query) ||
    event.details?.toLowerCase().includes(query) ||
    event.venue?.toLowerCase().includes(query)
  );
};

const applyFilters = (events, filters) => {
  let filteredEvents = [...events];

  if (filters.locationFilter) {
    const { label } = filters.locationFilter;
    if (label === "Online") {
      filteredEvents = filteredEvents.filter(event => event.online === true);
    } else if (label === "In-person") {
      filteredEvents = filteredEvents.filter(event => event.online === false);
    }
  }

  if (filters.statusFilter) {
    const { label } = filters.statusFilter;
    const currentDate = new Date();

    if (label === "Upcoming") {
      filteredEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.event_date);
        return eventDate > currentDate;
      });
    } else if (label === "Ongoing") {
      filteredEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.event_date);
        const eventEndDate = event.end_date ? new Date(event.end_date) : new Date(eventDate);
        eventEndDate.setHours(eventEndDate.getHours() + (event.duration || 2)); // Default 2-hour duration if not specified

        return eventDate <= currentDate && eventEndDate >= currentDate;
      });
    } else if (label === "Completed") {
      filteredEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.event_date);
        const eventEndDate = event.end_date ? new Date(event.end_date) : new Date(eventDate);
        eventEndDate.setHours(eventEndDate.getHours() + (event.duration || 2)); // Default 2-hour duration if not specified

        return eventEndDate < currentDate;
      });
    }
  }

  if (filters.startDateFilter) {
    const startDate = new Date(filters.startDateFilter);
    startDate.setHours(0, 0, 0, 0);
    filteredEvents = filteredEvents.filter(event => new Date(event.event_date) >= startDate);
  }

  if (filters.endDateFilter) {
    const endDate = new Date(filters.endDateFilter);
    endDate.setHours(23, 59, 59, 999);
    filteredEvents = filteredEvents.filter(event => new Date(event.event_date) <= endDate);
  }

  return filteredEvents;
};


const sortEvents = (events, sortFilter) => {
  if (!sortFilter) return events;

  const { label } = sortFilter;
  let sortedEvents = [...events];

  if (label === "Newest First") {
    sortedEvents.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
  } else if (label === "Oldest First") {
    sortedEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
  } else if (label === "Popular") {
    sortedEvents.sort((a, b) => (b.interest_count || 0) - (a.interest_count || 0));
  }

  return sortedEvents;
};

const paginateEvents = (events, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  return events.slice(startIndex, endIndex);
};


const fetchEvents = async (supabase, filters) => {
  try {

    const { data, error } = await supabase.rpc("fetch_events");

    if (error) {
      console.error("Error fetching events:", error);
      return { data: [], count: 0, error };
    }

    if (!data || data.length === 0) {
      return { data: [], count: 0, error: null };
    }

    let processedEvents = data;

    if (filters.searchQuery) {
      processedEvents = searchEvents(processedEvents, filters.searchQuery);
    }

    processedEvents = applyFilters(processedEvents, filters);

    if (filters.sortFilter) {
      processedEvents = sortEvents(processedEvents, filters.sortFilter);
    } else {
      processedEvents.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
    }

    const totalCount = processedEvents.length;

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 4;
    const paginatedEvents = paginateEvents(processedEvents, page, limit);

    return {
      data: paginatedEvents,
      count: totalCount,
      error: null
    };
  } catch (error) {
    console.error("Error in fetchEventsHome service:", error);
    return {
      data: [],
      count: 0,
      error
    };
  }
};

const fetchActiveEvents = async (supabase)=>{
  return await supabase
    .from("active_events_view")
    .select("active_events_count")
    .single();
};

const fetchUpcomingEvents = async (supabase)=>{
  return await supabase
    .from("upcoming_events")
    .select("*");
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
  fetchActiveEvents,
  fetchUpcomingEvents,
  checkExistingEvent,
  checkExistingEventById,
  insertEvent,
  findEvent,
  updateEventData,
  deleteEvent
};

export default eventsService;
