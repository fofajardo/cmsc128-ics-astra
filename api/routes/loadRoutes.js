import usersRouter from "./usersRoutes.js";
import alumniProfilesRouter from "./alumniProfilesRoutes.js";
import workExperiencesRouter from "./workExperiencesRoutes.js";
import eventsRouter from "./eventsRoutes.js";
import eventInterestsRouter from "./eventInterestsRoutes.js";

const registerRoutes = (app, supabase) => {
    app.use("/v1/users", usersRouter(supabase));
    app.use("/v1/alumniProfiles", alumniProfilesRouter(supabase));
    app.use("/v1/work_experiences", workExperiencesRouter(supabase));
    app.use("/v1/events", eventsRouter(supabase));
    app.use("/v1/eventInterests", eventInterestsRouter(supabase));
}

export default registerRoutes;