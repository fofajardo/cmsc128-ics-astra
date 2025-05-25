import usersRouter from "./usersRoutes.js";
import alumniProfilesRouter from "./alumniProfilesRoutes.js";
import degreeProgramsRouter from "./degreeProgramRoutes.js";
import photosRouter from "./photosRoutes.js";

import fs from "fs";
import path from "path";
import contentsRouter from "./contentsRoutes.js";
import workExperiencesRouter from "./workExperiencesRoutes.js";
import eventsRouter from "./eventsRoutes.js";
import eventInterestsRouter from "./eventInterestsRoutes.js";
import authRouter from "./authRoutes.js";
import projectsRouter from "./projectsRoutes.js";
import donationsRouter from "./donationsRoutes.js";
import organizationsRouter from "./organizationsRoutes.js";
import usersExtensionRoutes from "./usersExtensionRoutes.js";
import postsRouter from "./postsRoutes.js";
import reportsRouter from "./reportsRoutes.js";
import requestsRouter from "./requestsRoutes.js";
import jobsRouter from "./jobsRoutes.js";
import statisticsRouter from "./statisticsRoutes.js";
import emailRouter from "./emailRoutes.js";
import {serverRoutes} from "../../common/routes.js";
import multer from "multer";

const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //     cb(null, "assets/photos/"); // Directory where files will be stored
  // },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`); // sample filename
  },
});

const upload = multer({ storage });

const ensureDirectoriesExist = () => {
  const photosDir = path.join("assets", "photos");
  if (!fs.existsSync(photosDir)) {
    fs.mkdirSync(photosDir, {recursive: true});
    console.log(`Created directory: ${photosDir}`);
  }
};

const registerRoutes = (app) => {
  ensureDirectoriesExist(); // Ensure the directory exists before using it

  app.use(serverRoutes.auth.base(), authRouter());
  app.use(serverRoutes.users.base(), usersRouter());
  app.use(serverRoutes.users.base(), usersExtensionRoutes(upload));
  app.use(serverRoutes.degreePrograms.base(), degreeProgramsRouter());
  app.use(serverRoutes.photos.base(), photosRouter(upload));
  app.use(serverRoutes.alumniProfiles.base(), alumniProfilesRouter());
  app.use(serverRoutes.contents.base(), contentsRouter());
  app.use(serverRoutes.workExperiences.base(), workExperiencesRouter());
  app.use(serverRoutes.events.base(), eventsRouter());
  app.use(serverRoutes.eventInterests.base(), eventInterestsRouter());
  app.use(serverRoutes.announcements.base(), postsRouter());
  app.use(serverRoutes.projects.base(), projectsRouter());
  app.use(serverRoutes.donations.base(), donationsRouter());
  app.use(serverRoutes.organizations.base(), organizationsRouter());
  app.use(serverRoutes.reports.base(), reportsRouter());
  app.use(serverRoutes.requests.base(), requestsRouter());
  app.use(serverRoutes.jobs.base(), jobsRouter());
  app.use(serverRoutes.statistics.base(), statisticsRouter());
  app.use(serverRoutes.email.base(), emailRouter());
};

export default registerRoutes;