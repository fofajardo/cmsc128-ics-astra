import env from "dotenv";
import express from "express";
import session from "express-session";
import httpStatus from "http-status-codes";
import passport from "passport";
import { createClient } from "@supabase/supabase-js";
import authRouter from "./routes/auth/auth-router.js";
import { registerStrategies } from "./routes/auth/passport-strategies.js";
import getUsersRouter from "./routes/users/get-users.js";
import postUsersRouter from "./routes/users/post-users.js";
import putUsersRouter from "./routes/users/put-users.js";
import deleteUsersRouter from "./routes/users/delete-users.js";
import getAlumniRouter from "./routes/alumni/get-alumni.js";
import postAlumniRouter from "./routes/alumni/post-alumni.js";
import putAlumniRouter from "./routes/alumni/put-alumni.js";
import getEventsRouter from "./routes/events/get-events.js";
import getDonationsRouter from "./routes/donations/get-donations.js";
import postDonationsRouter from "./routes/donations/post-donations.js";
import putDonationsRouter from "./routes/donations/put-donations.js";
import deleteDonationsRouter from "./routes/donations/delete-donations.js";
import getJobsRouter from "./routes/jobs/get-jobs.js";
import getOrganizationsRouter from "./routes/organizations/get-organizations.js";
import postOrganizationsRouter from "./routes/organizations/post-organizations.js"
import deleteOrganizationsRouter from "./routes/organizations/delete-organizations.js"
import putOrganizationsRouter from "./routes/organizations/put-organizations.js";

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

gServer.use('/v1/users', getUsersRouter(testingSupabase));
gServer.use('/v1/users', postUsersRouter(testingSupabase));
gServer.use('/v1/users', putUsersRouter(testingSupabase));
gServer.use('/v1/users', deleteUsersRouter(testingSupabase));
gServer.use('/v1/alumni', getAlumniRouter(testingSupabase));
gServer.use('/v1/alumni', postAlumniRouter(testingSupabase));
gServer.use('/v1/alumni', putAlumniRouter(testingSupabase));
gServer.use('/v1/jobs', getJobsRouter(testingSupabase));
gServer.use('/v1/events', getEventsRouter(testingSupabase));
gServer.use('/v1/auth', authRouter());
gServer.use('/v1/donations', getDonationsRouter(testingSupabase));
gServer.use('/v1/donations', postDonationsRouter(testingSupabase));
gServer.use('/v1/donations', putDonationsRouter(testingSupabase));
gServer.use('/v1/donations', deleteDonationsRouter(testingSupabase));
gServer.use('/v1/organizations', getOrganizationsRouter(testingSupabase));
gServer.use('/v1/organizations', postOrganizationsRouter(testingSupabase));
gServer.use('/v1/organizations', deleteOrganizationsRouter(testingSupabase));
gServer.use('/v1/organizations', putOrganizationsRouter(testingSupabase));

export default gServer;

gServer.listen(process.env.PORT, () => {
    console.log(`Listening to port: ${process.env.PORT}`);
});