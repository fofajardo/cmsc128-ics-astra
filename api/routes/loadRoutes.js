import usersRouter from "./usersRoutes.js";
import alumniProfilesRouter from "./alumniProfilesRoutes.js";
import degreeProgramsRouter from "./degreeProgramRoutes.js";
import photosRouter from "./photosRoutes.js";

import fs from "fs";
import path from "path";
// import { use } from "passport";

import passport from "passport";
const { use } = passport;

const ensureDirectoriesExist = () => {
    const photosDir = path.join("assets", "photos");
    if (!fs.existsSync(photosDir)) {
        fs.mkdirSync(photosDir, { recursive: true });
        console.log(`Created directory: ${photosDir}`);
    }
};

const registerRoutes = (app, supabase) => {
    ensureDirectoriesExist(); // Ensure the directory exists before using it

    app.use("/v1/users", usersRouter(supabase));
    app.use("/v1/alumniProfiles", alumniProfilesRouter(supabase));
    app.use("/v1/degree-programs", degreeProgramsRouter(supabase));
    app.use("/v1/photos", photosRouter(supabase));
}

export default registerRoutes;