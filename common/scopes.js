export const RouteGuardMode = Object.freeze({
  AUTO: "auto",
  RA: "authenticated",
  RU: "unauthenticated",
  AUTH_SIGN_UP: "auth-sign-up",
  ADMIN: "admin",
});

const RoleName = Object.freeze({
  UNLINKED: "unlinked",
  ALUMNUS: "alumnus",
  MODERATOR: "moderator",
  ADMIN: "admin",
  isDefined: function(aValue) {
    if (typeof aValue === "string" || aValue instanceof String) {
      const value = aValue.toLowerCase().trim();
      switch (value) {
      case RoleName.UNLINKED:
      case RoleName.ALUMNUS:
      case RoleName.MODERATOR:
      case RoleName.ADMIN:
        return true;
      default:
        break;
      }
    }
    return false;
  },
  parse: function(aValue) {
    if (!this.isDefined(aValue)) {
      return null;
    }
    return parseInt(aValue);
  },
});

// REVIEW: This should be kept in sync with entity names.
const Subjects = Object.freeze({
  ALL: "all",
  ALUMNI_PROFILE: "AlumniProfile",
  CONTACT: "Contact",
  CONTENT: "Content",
  DEGREE_PROGRAM: "DegreeProgram",
  DONATION: "Donation",
  EVENT: "Event",
  EVENT_INTEREST: "EventInterest",
  FORM_RESPONSE: "FormResponse",
  JOB: "Job",
  ORGANIZATION: "Organization",
  // Organization affiliation is implied by alumni profile.
  PHOTO: "Photo",
  PROJECT: "Project",
  QUESTION: "Question",
  REPORT: "Report",
  REQUEST: "Request",
  USER: "User",
  WORK_EXPERIENCE: "WorkExperience",
});

const Actions = Object.freeze({
  CREATE: "create",
  READ: "read",
  MANAGE: "manage",
});

export { RoleName, Subjects, Actions };
