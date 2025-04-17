import usersRouter from "./usersRoutes.js";
import alumniProfilesRouter from "./alumniProfilesRoutes.js";
import workExperiencesRouter from "./workExperiencesRoutes.js";

const registerRoutes = (app, supabase) => {
    app.use("/v1/users", usersRouter(supabase));
    app.use("/v1/alumniProfiles", alumniProfilesRouter(supabase));
    app.use("/v1/work_experiences", workExperiencesRouter(supabase));
}

export default registerRoutes;