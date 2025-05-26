const fetchContacts = async (supabase, userId = null) => {
  const query = supabase
    .from("contacts")
    .select("*");

  return await (userId
    ? query.eq("user_id", userId)
    : query);
};

const fetchContactById = async (supabase, id) => {
  return await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .single();
};

const checkExistingContact = async (supabase, userId, type, content) => {
  return await supabase
    .from("contacts")
    .select()
    .match({ user_id: userId, type, content });
};

const insertContact = async (supabase, contactData) => {
  return await supabase
    .from("contacts")
    .insert(contactData)
    .select();
};

const updateContact = async (supabase, id, updateData) => {
  return await supabase
    .from("contacts")
    .update(updateData)
    .eq("id", id)
    .select();
};

const deleteContact = async (supabase, id) => {
  return await supabase
    .from("contacts")
    .delete()
    .eq("id", id);
};

const contactsService = {
  fetchContacts,
  fetchContactById,
  checkExistingContact,
  insertContact,
  updateContact,
  deleteContact,
};

export default contactsService;