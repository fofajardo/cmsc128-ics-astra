const fetchEventInterests = async (supabase, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + Number(limit) - 1;

  return await supabase
    .from("event_interests")
    .select("*")
    .range(startIndex, endIndex);
};

const fetchEventInterestByAlumnId = async (supabase, alumnId) => {
  return await supabase
    .from("event_interests")
    .select("content_id")
    .eq("user_id", alumnId);
};
const fetchEventInterestStat = async (supabase, eventId)=> {
  return await supabase
    .from("event_interest_stats")
    .select("interest_count")
    .eq("event_id", eventId);
};
const fetchEventInterestByContentId = async (supabase, contentId) => {
  return await supabase
    .from("event_interests")
    .select("user_id")
    .eq("content_id", contentId);
};

const checkExistingEventInterest = async (supabase, alumnId, contentId) => {
  return await supabase
    .from("event_interests")
    .select()
    .match({ user_id: alumnId, content_id: contentId });
};

const insertEventInterest = async (supabase, eventInterestData) => {
  return await supabase
    .from("event_interests")
    .insert(eventInterestData)
    .select();
};

const findEventInterests = async (supabase, alumnId, contentId) => {
  return await supabase
    .from("event_interests")
    .select("*")
    .match({ user_id: alumnId, content_id: contentId })
    .single();
};


const deleteEventInterest = async (supabase, alumnId, contentId) => {
  return await supabase
    .from("event_interests")
    .delete()
    .match({ user_id: alumnId, content_id: contentId });
};

const eventInterestsService = {
  fetchEventInterests,
  fetchEventInterestByAlumnId,
  fetchEventInterestByContentId,
  fetchEventInterestStat,
  checkExistingEventInterest,
  insertEventInterest,
  findEventInterests,
  deleteEventInterest
};

export default eventInterestsService;
