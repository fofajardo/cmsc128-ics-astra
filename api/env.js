import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const envConfig = dotenv.config({ path: [".env", "../.env"] });
dotenvExpand.expand(envConfig);
