import env from "dotenv";
import express from "express";
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
