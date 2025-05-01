import { object, string, number, date } from "yup";

export const AuthSchema = object({
  username: string().label("Email or username").email().required(),
  password: string().label("Password").required(),
});
