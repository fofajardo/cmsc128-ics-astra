import usersRouter from "./usersRoutes.js";
import alumniProfilesRouter from "./alumniProfilesRoutes.js";

const registerRoutes = (app, supabase) => {
    app.use("/v1/users", usersRouter(supabase));
    app.use("/v1/alumni", alumniProfilesRouter(supabase));
}

export default registerRoutes;