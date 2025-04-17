import env from "dotenv";
import express from "express";
import session from "express-session";
import httpStatus from "http-status-codes";
import passport from "passport";
import { createClient } from "@supabase/supabase-js";
import authRouter from "./routes/auth/auth-router.js";
import { registerStrategies } from "./routes/auth/passport-strategies.js";
import usersRouter from "./routes/usersRoutes.js";
import eventsRouter from "./routes/eventsRoutes.js";
import getAlumniRouter from "./routes/alumni/get-alumni.js";
import postAlumniRouter from "./routes/alumni/post-alumni.js";
import putAlumniRouter from "./routes/alumni/put-alumni.js";
import getEventsRouter from "./routes/events/get-events.js";
import deleteEventsRouter from "./routes/events/delete-events.js";
import getProjectsRouter from "./routes/projects/get-projects.js";
import postProjectsRouter from "./routes/projects/post-projects.js";
import putProjectsRouter from "./routes/projects/put-projects.js";
import deleteProjectsRouter from "./routes/projects/delete-projects.js";
import getContentsRouter from "./routes/contents/get-contents.js";
import postContentRouter from "./routes/contents/post-contents.js";
import putContentRouter from "./routes/contents/put-contents.js";
import deleteContentRouter from "./routes/contents/delete-content.js"
import getEventInterestsRouter from "./routes/eventInterests/get-eventInterests.js";
import deleteEventInterestsRouter from "./routes/eventInterests/delete-eventInterests.js";
import postEventInterestsRouter from "./routes/eventInterests/post-eventInterests.js";
import getDonationsRouter from "./routes/donations/get-donations.js";
import postDonationsRouter from "./routes/donations/post-donations.js";
import putDonationsRouter from "./routes/donations/put-donations.js";
import deleteDonationsRouter from "./routes/donations/delete-donations.js";
import getJobsRouter from "./routes/jobs/get-jobs.js";
import getOrganizationsRouter from "./routes/organizations/get-organizations.js";
import postOrganizationsRouter from "./routes/organizations/post-organizations.js"
import deleteOrganizationsRouter from "./routes/organizations/delete-organizations.js"
import putOrganizationsRouter from "./routes/organizations/put-organizations.js";
import putJobsRouter from "./routes/jobs/put-jobs.js";
import putEventsRouter from "./routes/events/put-events.js";

env.config();

const gServer = express();
// const supabase = createClient(process.env.DATABASE_URL, process.env.DATABASE_ANONYMOUS_KEY);
const testingSupabase = createClient(process.env.DATABASE_URL, process.env.DATABASE_SERVICE_KEY);

// Use appropriate parsers to access the request/response body directly.
gServer.use(express.json());
gServer.use(express.urlencoded({ extended: false }));

gServer.get("/", (req, res) => {
    res.status(httpStatus.OK).json({ message: "API is working!" });
});

// Set up session handling to use .
gServer.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "047afa6b-829a-432a-b962-e7a4e9fe7d9d",
    // FIXME: sessions are not persisted.
}));

// Set up Passport.js authentication.
gServer.use(passport.authenticate("session"));

registerStrategies(testingSupabase);

gServer.use('/v1/users', usersRouter(testingSupabase));
gServer.use('/v1/events', eventsRouter(testingSupabase));
gServer.use('/v1/alumni', getAlumniRouter(testingSupabase));
gServer.use('/v1/alumni', postAlumniRouter(testingSupabase));
gServer.use('/v1/alumni', putAlumniRouter(testingSupabase));
gServer.use('/v1/jobs', getJobsRouter(testingSupabase));
gServer.use('/v1/projects', getProjectsRouter(testingSupabase));
gServer.use('/v1/projects', postProjectsRouter(testingSupabase));
gServer.use('/v1/projects', putProjectsRouter(testingSupabase));
gServer.use('/v1/projects', deleteProjectsRouter(testingSupabase));
gServer.use(
    '/v1/contents',
    getContentsRouter(testingSupabase),
    postContentRouter(testingSupabase),
    putContentRouter(testingSupabase),
    deleteContentRouter(testingSupabase)
);
gServer.use('/v1/eventInterests', getEventInterestsRouter(testingSupabase), postEventInterestsRouter(testingSupabase), deleteEventInterestsRouter(testingSupabase));
gServer.use('/v1/auth', authRouter());
gServer.use('/v1/donations', getDonationsRouter(testingSupabase));
gServer.use('/v1/donations', postDonationsRouter(testingSupabase));
gServer.use('/v1/donations', putDonationsRouter(testingSupabase));
gServer.use('/v1/donations', deleteDonationsRouter(testingSupabase));
gServer.use('/v1/organizations', getOrganizationsRouter(testingSupabase));
gServer.use('/v1/organizations', postOrganizationsRouter(testingSupabase));
gServer.use('/v1/organizations', deleteOrganizationsRouter(testingSupabase));
gServer.use('/v1/organizations', putOrganizationsRouter(testingSupabase));

gServer.use('/v1/jobs', putJobsRouter(testingSupabase));

export default gServer;

gServer.listen(process.env.PORT, () => {
    console.log(`Listening to port: ${process.env.PORT}`);
});