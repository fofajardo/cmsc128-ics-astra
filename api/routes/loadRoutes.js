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
import requestsRouter from "./requestsRoutes.js";
import jobsRouter from "./jobsRoutes.js";

const registerRoutes = (app) => {
    ensureDirectoriesExist(); // Ensure the directory exists before using it

    app.use("/v1/users", usersRouter());
    app.use("/v1/degree-programs", degreeProgramsRouter());
    app.use("/v1/photos", photosRouter());
    app.use("/v1/alumni-profiles", alumniProfilesRouter());
    app.use("/v1/contents", contentsRouter());
    app.use("/v1/work-experiences", workExperiencesRouter());
    app.use("/v1/events", eventsRouter());
    app.use("/v1/event-interests", eventInterestsRouter());
    app.use('/v1/auth', authRouter());
    app.use("/v1/projects", projectsRouter());
    app.use("/v1/donations", donationsRouter());
    app.use("/v1/organizations", organizationsRouter());
    app.use("/v1/organization-affiliations", organizationAffiliationsRouter());
    app.use("/v1/reports", reportsRouter());
    app.use("/v1/requests", requestsRouter());
    app.use("/v1/jobs", jobsRouter());
}

export default registerRoutes;