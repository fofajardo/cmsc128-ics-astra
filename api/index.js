import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import httpStatus from "http-status-codes";
import getUsersRouter from "./routes/users/get-users.js";
import getAlumniRouter from "./routes/alumni/get-alumni.js";
import getJobsRouter from "./routes/jobs/get-jobs.js";
import getEventsRouter from "./routes/events/get-events.js";

import postImageRouter from "./routes/photos/post-photos.js";
import getImageRouter from "./routes/photos/get-photos.js";
import deletePhotosRouter from "./routes/photos/delete-photos.js";
import putPhotosRouter from "./routes/photos/put-photos.js";

import postDegreeRouter from "./routes/degree_programs/post-degree.js";
import getDegreeRouter from "./routes/degree_programs/get-degree.js";
import deleteDegreeRouter from "./routes/degree_programs/delete-degree.js";
import putDegreeRouter from "./routes/degree_programs/put-degree.js";

dotenv.config();

console.log(process.env.SUPABASE_URL);
console.log(process.env.DATABASE_SERVICE_KEY);

const gServer = express();
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const testingSupabase = createClient(process.env.SUPABASE_URL, process.env.DATABASE_SERVICE_KEY);

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

gServer.use('/upload-image', postImageRouter(testingSupabase));
gServer.use('/get-image', getImageRouter(testingSupabase));
gServer.use('/delete-image', deletePhotosRouter(testingSupabase));
gServer.use('/update-image', putPhotosRouter(testingSupabase));

gServer.use('/post-degree', postDegreeRouter(testingSupabase));
gServer.use('/get-degree', getDegreeRouter(testingSupabase));
gServer.use('/delete-degree', deleteDegreeRouter(testingSupabase));
gServer.use('/put-degree', putDegreeRouter(testingSupabase));

export default gServer;

gServer.listen(process.env.PORT, () => {
    console.log(`Listening to port: ${process.env.PORT}`);
});