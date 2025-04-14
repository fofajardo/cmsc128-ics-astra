import express from "express";
import env from "dotenv";
import { createClient } from "@supabase/supabase-js";
import httpStatus from "http-status-codes";
// import getUsersRouter from "./routes/users/get-users.js";
// import postUsersRouter from "./routes/users/post-users.js";
// import putUsersRouter from "./routes/users/put-users.js";
// import deleteUsersRouter from "./routes/users/delete-users.js";
// import getAlumniRouter from "./routes/alumni/get-alumni.js";
// import postAlumniRouter from "./routes/alumni/post-alumni.js";
// import putAlumniRouter from "./routes/alumni/put-alumni.js";
// import getEventsRouter from "./routes/events/get-events.js";
// import getJobsRouter from "./routes/jobs/get-jobs.js";
import getOrganizationsRouter from "./routes/organizations/get-organizations.js";

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

// gServer.use('/v1/users', getUsersRouter(testingSupabase));
// gServer.use('/v1/users', postUsersRouter(testingSupabase));
// gServer.use('/v1/users', putUsersRouter(testingSupabase));
// gServer.use('/v1/users', deleteUsersRouter(testingSupabase));
// gServer.use('/v1/alumni', getAlumniRouter(testingSupabase));
// gServer.use('/v1/alumni', postAlumniRouter(testingSupabase));
// gServer.use('/v1/alumni', putAlumniRouter(testingSupabase));
// gServer.use('/v1/jobs', getJobsRouter(testingSupabase));
// gServer.use('/v1/events', getEventsRouter(testingSupabase));
gServer.use('/v1/organizations', getOrganizationsRouter(testingSupabase));

export default gServer;

gServer.listen(process.env.PORT, () => {
    console.log(`Listening to port: ${process.env.PORT}`);
});