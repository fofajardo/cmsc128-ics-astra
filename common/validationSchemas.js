import {boolean, date, mixed, number, object, ref, string} from "yup";

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

export const PersonalInfoUpdateSchema = object({
  honorifics: string().required("Title is required"),
  first_name: string().required("First name is required"),
  middle_name: string().required("Middle name is required"),
  last_name: string().required("Last name is required"),
  civil_status: string().required("Civil status is required"),
  citizenship: string().required("Citizenship is required"),
  is_profile_public: boolean(),
});

export const AddressInfoUpdateSchema = object({
  location: string().required("Location is required"),
  address: string().required("Address is required"),
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

export const DegreeProgramSchema2 = object().shape({
  is_uplb: boolean(),
  uplb_program: string().when("is_uplb", {
    is: true,
    then: (schema) => schema.required("Please select a UPLB ICS degree program"),
    otherwise: (schema) => schema.notRequired(),
  }),
  name: string().when("is_uplb", {
    is: false,
    then: (schema) => schema.required("Degree name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  level: string().when("is_uplb", {
    is: false,
    then: (schema) => schema.required("Degree level is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  institution: string().when("is_uplb", {
    is: false,
    then: (schema) => schema.required("Institution is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  year_started: string()
    .required("Year started is required")
    .matches(/^\d{4}$/, "Year must be a 4-digit number")
    .test("year_range", "Year must be between 1908 and current year", (value) => {
      if (!value) return true;
      const year = parseInt(value);
      return year >= 1908 && year <= new Date().getFullYear();
    }),
  year_graduated: string()
    .required("Year graduated is required")
    .matches(/^\d{4}$/, "Year must be a 4-digit number")
    .test("year_range", "Year must be between 1908 and current year", (value) => {
      if (!value) return true;
      const year = parseInt(value);
      return year >= 1908 && year <= new Date().getFullYear();
    })
    .test("year_order", "Graduation year must be after or equal to start year", function(value) {
      const startYear = this.parent.year_started;
      if (!value || !startYear) return true;
      return parseInt(value) >= parseInt(startYear);
    }),
});

export const GraduationProofSchema = object({
  proof_file: mixed().required("Proof of graduation is required")
});

export const ExperienceSchema = object({
  company: string().required("Company or organization is required"),
  title: string().required("Title is required"),
  field: string().required("Field is required"),
  employment_type: string().required("Employment type is required"),
  location: string().required("Location is required"),
  location_type: string().required("Location type is required"),
  startDate: object().shape({
    month: string().required("Start month is required"),
    year: string().required("Start year is required")
  }),
  endDate: object().when("is_current", {
    is: false,
    then: () => object().shape({
      month: string().required("End month is required"),
      year: string().required("End year is required")
    }),
    otherwise: () => object().shape({
      month: string(),
      year: string()
    })
  }),
  is_current: boolean(),
  description: string(),
  salary: number().required("Salary is required")
});

export const AffiliationSchema = object().shape({
  org_id: string().required("Organization is required"),
  role: string().required("Role is required"),
  is_current: boolean(),
  startDate: object().shape({
    month: string().required("Start month is required"),
    year: string().required("Start year is required")
  }),
  endDate: object().when("is_current", {
    is: false,
    then: () => object().shape({
      month: string().required("End month is required"),
      year: string().required("End year is required")
    }),
    otherwise: () => object()
  }),
  description: string()
});

export const ContactSchema = object({
  type: number()
    .required("Contact type is required"),
  content: string()
    .required("Contact information is required")
    .min(3, "Contact information must be at least 3 characters")
    .max(255, "Contact information must not exceed 255 characters")
});
