import usersRouter from "./usersRoutes.js";
import alumniProfilesRouter from "./alumniProfilesRoutes.js";
import workExperiencesRouter from "./workExperiencesRoutes.js";
import eventsRouter from "./eventsRoutes.js";
import eventInterestsRouter from "./eventInterestsRoutes.js";
import authRouter from "./authRoutes.js";
import projectsRouter from "./projectsRoutes.js";
import donationsRouter from "./donationsRoutes.js";
import organizationsRouter from "./organizationsRoutes.js";

const registerRoutes = (app, supabase) => {
    app.use("/v1/users", usersRouter(supabase));
    app.use("/v1/alumni", alumniProfilesRouter(supabase));
    app.use("/v1/work_experiences", workExperiencesRouter(supabase));
    app.use("/v1/events", eventsRouter(supabase));
    app.use("/v1/eventInterests", eventInterestsRouter(supabase));
    app.use('/v1/auth', authRouter());
    app.use("/v1/projects", projectsRouter(supabase));
    app.use("/v1/donations", donationsRouter(supabase));
    app.use("/v1/organizations", organizationsRouter(supabase));
}

export default registerRoutes;