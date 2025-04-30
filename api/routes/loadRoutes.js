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
import {Routes} from "../../common/routes.js";

const registerRoutes = (app) => {
  ensureDirectoriesExist(); // Ensure the directory exists before using it

  app.use(Routes.auth.base(), authRouter());
  app.use(Routes.users.base(), usersRouter());
  app.use(Routes.degreePrograms.base(), degreeProgramsRouter());
  app.use(Routes.photos.base(), photosRouter());
  app.use(Routes.alumniProfiles.base(), alumniProfilesRouter());
  app.use(Routes.contents.base(), contentsRouter());
  app.use(Routes.workExperiences.base(), workExperiencesRouter());
  app.use(Routes.events.base(), eventsRouter());
  app.use(Routes.eventInterests.base(), eventInterestsRouter());
  app.use(Routes.projects.base(), projectsRouter());
  app.use(Routes.donations.base(), donationsRouter());
  app.use(Routes.organizations.base(), organizationsRouter());
  app.use(Routes.organizationAffiliations.base(), organizationAffiliationsRouter());
  app.use(Routes.reports.base(), reportsRouter());
  app.use(Routes.requests.base(), requestsRouter());
  app.use(Routes.jobs.base(), jobsRouter());
};

export default registerRoutes;