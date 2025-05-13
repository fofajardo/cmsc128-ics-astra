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

const PhotoType = Object.freeze({
  PROFILE_PIC: 0,
  PROOF_OF_PAYMENT: 1,
  PROOF_OF_GRADUATION: 2,
  EVENT_PIC: 3,
  JOB_PIC: 4,
  PROJECT_PIC: 5,
  POSTS_PIC: 6,
  isDefined: function(aValue) {
    if (typeof aValue === "string" || aValue instanceof String) {
      const value = aValue.toLowerCase().trim();
      switch (value) {
      case PhotoType.PROFILE_PIC:
      case PhotoType.PROOF_OF_PAYMENT:
      case PhotoType.PROOF_OF_GRADUATION:
      case PhotoType.EVENT_PIC:
      case PhotoType.JOB_PIC:
      case PhotoType.PROJECT_PIC:
      case PhotoType.POSTS_PIC:
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
})

const EmploymentStatus = Object.freeze({
  UNEMPLOYED: 0,
  EMPLOYED: 1,
  SELF_EMPLOYED: 2,
  isDefined: function(aValue) {
    if (typeof aValue === "string" || aValue instanceof String) {
      const value = aValue.toLowerCase().trim();
      switch (value) {
      case EmploymentStatus.UNEMPLOYED:
      case EmploymentStatus.EMPLOYED:
      case EmploymentStatus.SELF-EMPLOYED:
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
})

export {
  RoleName,
  Subjects,
  Actions,
  EmploymentStatus,
};
