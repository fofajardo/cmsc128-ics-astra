import usersRouter from "./usersRoutes.js";
import alumniProfilesRouter from "./alumniProfilesRoutes.js";
import degreeProgramsRouter from "./degreeProgramRoutes.js";
import photosRouter from "./photosRoutes.js";

import fs from "fs";
import path from "path";

const ensureDirectoriesExist = () => {
    const photosDir = path.join("assets", "photos");
    if (!fs.existsSync(photosDir)) {
        fs.mkdirSync(photosDir, { recursive: true });
        console.log(`Created directory: ${photosDir}`);
    }
};

import contentsRouter from "./contentsRoutes.js";
import workExperiencesRouter from "./workExperiencesRoutes.js";
import eventsRouter from "./eventsRoutes.js";
import eventInterestsRouter from "./eventInterestsRoutes.js";
import authRouter from "./authRoutes.js";
import projectsRouter from "./projectsRoutes.js";
import donationsRouter from "./donationsRoutes.js";
import organizationsRouter from "./organizationsRoutes.js";
import organizationAffiliationsRouter from "./organizationAffiliationsRoutes.js";
import reportsRouter from "./reportsRoutes.js";

const registerRoutes = (app, supabase) => {
    ensureDirectoriesExist(); // Ensure the directory exists before using it

    app.use("/v1/users", usersRouter(supabase));
    app.use("/v1/degree-programs", degreeProgramsRouter(supabase));
    app.use("/v1/photos", photosRouter(supabase));
    app.use("/v1/alumni-profiles", alumniProfilesRouter(supabase));
    app.use("/v1/contents", contentsRouter(supabase));
    app.use("/v1/work-experiences", workExperiencesRouter(supabase));
    app.use("/v1/events", eventsRouter(supabase));
    app.use("/v1/event-interests", eventInterestsRouter(supabase));
    app.use('/v1/auth', authRouter());
    app.use("/v1/projects", projectsRouter(supabase));
    app.use("/v1/donations", donationsRouter(supabase));
    app.use("/v1/organizations", organizationsRouter(supabase));
    app.use("/v1/users", organizationAffiliationsRouter(supabase));
    app.use("/v1/reports", reportsRouter(supabase));
}

export default registerRoutes;