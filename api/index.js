import env from "dotenv";
import express from "express";
import session from "express-session";
import httpStatus from "http-status-codes";
import passport from "passport";
import { createClient } from "@supabase/supabase-js";
import { registerStrategies } from "./middleware/passportStrategies.js";
import registerRoutes from "./routes/loadRoutes.js";
import {InferAbility} from "./middleware/inferAbility.js";

env.config({ path: [".env", "../.env"] });

const gServer = express();
// const supabase = createClient(process.env.DATABASE_URL, process.env.DATABASE_ANONYMOUS_KEY);
const testingSupabase = createClient(process.env.DATABASE_URL, process.env.DATABASE_SERVICE_KEY);

// // Use appropriate parsers to access the request/response body directly.
// gServer.use(express.json());
// gServer.use(express.urlencoded({ extended: false }));

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
gServer.use(InferAbility);
registerRoutes(gServer, testingSupabase);

export default gServer;

const kPort = process.env.ICSA_API_PORT;
gServer.listen(kPort, () => {
    console.log(`Listening to port: ${kPort}`);
});
