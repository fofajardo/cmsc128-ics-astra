import usersRouter from "./usersRoutes.js";

const registerRoutes = (app, supabase) => {
    app.use("/v1/users", usersRouter(supabase));
}

export default registerRoutes;