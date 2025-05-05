import {object, string, number, date, ref, mixed, boolean} from "yup";

export const AuthSchema = object({
  username: string().label("Email").email().required(),
  password: string().label("Password").required(),
});

export const SignUpUserSchema = object({
  username: string().label("Email").email().required(),
  password: string()
    .label("Password")
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[!@#$%^&*()_\+\-=\[\]{};':"\\|,.<>\/?`~]/, "Must contain at least one special character"),
  passwordConfirm: string()
    .label("PasswordConfirm")
    .required("Please confirm your password")
    .oneOf([ref("password")], "Passwords must match"),
});

export const PersonalInfoSchema = object({
  birthdate: date().required("Birthdate is required"),
  location: string().required("Location is required"),
  address: string().required("Address is required"),
  gender: string(),
  student_num: string()
    .required("Student number is required")
    .matches(/^\d{4}-\d{5}$/, "Student number must follow format XXXX-XXXXX"),
  skills: string(),
  honorifics: string().required("Delegation is required"),
  citizenship: string().required("Citizenship is required"),
  sex: string().required("Sex is required"),
  civil_status: number().required("Civil status is required"),
  first_name: string().required("First name is required"),
  middle_name: string().required("Middle name is required"),
  last_name: string().required("Last name is required"),
  suffix: string(),
  is_profile_public: boolean(),
});

export const DegreeProgramSchema = object({
  degree_program_const: string().required("Degree program is required"),
  year_started: string()
    .required("Year started is required")
    .matches(/^\d{4}$/, "Year started must be a 4-digit number"),
  year_graduated: string()
    .required("Year graduated is required")
    .matches(/^\d{4}$/, "Year started must be a 4-digit number"),
});

export const GraduationProofSchema = object({
  proof_file: mixed().required("Proof of graduation is required")
});
