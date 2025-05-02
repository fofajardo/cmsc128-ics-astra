const fetchUsers = async (supabase, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + Number(limit) - 1;

  return await supabase
    .from("users")
    .select("*")
    .range(startIndex, endIndex);
};

const fetchUserById = async (supabase, userId) => {
  return await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
};

const checkExistingUser = async (supabase, username, email) => {
  return await supabase
    .from("users")
    .select("id")
    .or(`username.eq.${username},email.eq.${email}`);
};

const insertUser = async (supabase, userData) => {
  return await supabase
    .from("users")
    .insert(userData)
    .select("id");
};

const updateUserData = async (supabase, userId, updateData) => {
  return await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId);
};

const softDeleteUser = async (supabase, userId) => {
  return await supabase
    .from("users")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", userId);
};

const hardDeleteUser = async (supabase, userId) => {
  return await supabase
    .from("users")
    .delete()
    .eq("id", userId);
};

const usersService = {
  fetchUsers,
  fetchUserById,
  checkExistingUser,
  insertUser,
  updateUserData,
  softDeleteUser,
  hardDeleteUser
};

export default usersService;