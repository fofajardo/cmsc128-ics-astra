import env from "dotenv";
import express from "express";
import session from "express-session";
import httpStatus from "http-status-codes";
import registerRoutes from "./routes/loadRoutes.js";
import {InferAbility} from "./middleware/inferAbility.js";
import {BuildSupabaseClient} from "./middleware/buildSupabaseClient.js";
import {BuildAuth} from "./middleware/buildAuth.js";
import {ResponseHelper} from "./middleware/responseHelper.js";

env.config({ path: [".env", "../.env"] });

const gServer = express();

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

gServer.use(InferAbility);
gServer.use(BuildSupabaseClient);
gServer.use(BuildAuth);
gServer.use(ResponseHelper);
registerRoutes(gServer);

export default gServer;

const kPort = process.env.ICSA_API_PORT;
gServer.listen(kPort, () => {
    console.log(`Listening to port: ${kPort}`);
});
