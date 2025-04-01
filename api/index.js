import express from "express";
import httpStatus from "http-status-codes";

const kPort = 3001;
const gServer = express();

// Use appropriate parsers to access the request/response body directly.
gServer.use(express.json());
gServer.use(express.urlencoded({ extended: false }));

gServer.get("/", (req, res) => {
    res.status(httpStatus.OK).json({ message: "API is working!" });
});

export default gServer;

gServer.listen(kPort, () => {
    console.log(`Listening to port: ${kPort}`);
});
