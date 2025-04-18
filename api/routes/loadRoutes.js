import usersRouter from "./usersRoutes.js";
import alumniProfilesRouter from "./alumniProfilesRoutes.js";
import eventsRouter from "./eventsRoutes.js";
import eventInterestsRouter from "./eventInterestsRoutes.js";
import authRouter from "./authRoutes.js";

const registerRoutes = (app, supabase) => {
    app.use("/v1/users", usersRouter(supabase));
    app.use("/v1/alumniProfiles", alumniProfilesRouter(supabase));
    app.use("/v1/events", eventsRouter(supabase));
    app.use("/v1/eventInterests", eventInterestsRouter(supabase));
    app.use('/v1/auth', authRouter());
}

export default registerRoutes;