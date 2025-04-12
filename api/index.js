import express from "express";
import env from "dotenv";
import { createClient } from "@supabase/supabase-js";
import httpStatus from "http-status-codes";
import getUsersRouter from "./routes/users/get-users.js";
import getAlumniRouter from "./routes/alumni/get-alumni.js";
import getJobsRouter from "./routes/jobs/get-jobs.js";
import getEventsRouter from "./routes/events/get-events.js";
import getProjectsRouter from "./routes/projects/get-projects.js";
import postProjectsRouter from "./routes/projects/post-projects.js";
import putProjectsRouter from "./routes/projects/put-projects.js";
import deleteProjectsRouter from "./routes/projects/delete-projects.js";

env.config();

const gServer = express();
const supabase = createClient(process.env.DATABASE_URL, process.env.DATABASE_ANONYMOUS_KEY);
const testingSupabase = createClient(process.env.DATABASE_URL, process.env.DATABASE_SERVICE_KEY);

// Use appropriate parsers to access the request/response body directly.
gServer.use(express.json());
gServer.use(express.urlencoded({ extended: false }));

gServer.get("/", (req, res) => {
    res.status(httpStatus.OK).json({ message: "API is working!" });
});

gServer.use('/v1/users', getUsersRouter(testingSupabase));
gServer.use('/v1/alumni', getAlumniRouter(testingSupabase));
gServer.use('/v1/jobs', getJobsRouter(testingSupabase));
gServer.use('/v1/events', getEventsRouter(testingSupabase));
gServer.use('/v1/projects', getProjectsRouter(testingSupabase));
gServer.use('/v1/projects', postProjectsRouter(testingSupabase));
gServer.use('/v1/projects', putProjectsRouter(testingSupabase));
gServer.use('/v1/projects', deleteProjectsRouter(testingSupabase));

export default gServer;

gServer.listen(process.env.PORT, () => {
    console.log(`Listening to port: ${process.env.PORT}`);
});