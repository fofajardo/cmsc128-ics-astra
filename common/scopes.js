import {Facebook, HelpCircle, Linkedin, Mail, MessageCircle, Phone, Send} from "lucide-react";

export const RouteGuardMode = Object.freeze({
  AUTO: "auto",
  AUTHENTICATED: "auth",
  AUTHENTICATED_ADMIN: "auth-admin",
  AUTHENTICATED_SIGN_UP: "auth-sign-up",
  UNAUTHENTICATED: "unauthenticated",
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
});

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
      case EmploymentStatus.SELF_EMPLOYED:
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

export const EmploymentType = Object.freeze({
  FULL_TIME: 0,
  PART_TIME: 1,
  SELF_EMPLOYED: 2,
  FREELANCE: 3,
  CONTRACT: 4,
  INTERNSHIP: 5,
  APPRENTICESHIP: 6,
  SEASONAL: 7,
  isDefined: function(aValue) {
    return Object.values(this).includes(aValue);
  },
  parse: function(aValue) {
    if (!this.isDefined(aValue)) {
      return null;
    }
    return parseInt(aValue);
  },
});

export const EMPLOYMENT_STATUS_LABELS = {
  [EmploymentType.FULL_TIME]: "Full-time",
  [EmploymentType.PART_TIME]: "Part-time",
  [EmploymentType.SELF_EMPLOYED]: "Self-employed",
  [EmploymentType.FREELANCE]: "Freelance",
  [EmploymentType.CONTRACT]: "Contract",
  [EmploymentType.INTERNSHIP]: "Internship",
  [EmploymentType.APPRENTICESHIP]: "Apprenticeship",
  [EmploymentType.SEASONAL]: "Seasonal",
};

export const LocationType = Object.freeze({
  ON_SITE: 0,
  HYBRID: 1,
  REMOTE: 2,
  isDefined: function(aValue) {
    return Object.values(LocationType).includes(aValue);
  },
  parse: function(aValue) {
    return this.isDefined(aValue) ? aValue : null;
  },
});

export const LOCATION_TYPE_LABELS = {
  [LocationType.ON_SITE]: "On-site",
  [LocationType.HYBRID]: "Hybrid",
  [LocationType.REMOTE]: "Remote",
};

const JobsStatus = Object.freeze({
  OPEN_INDEFINITE: 0,
  OPEN_UNTIL_EXPIRED: 1,
  ON_HOLD: 2,
  CLOSED: 3,
  isDefined: function(aValue) {
    if (typeof aValue === "string" || aValue instanceof String) {
      const value = aValue.toLowerCase().trim();
      switch (value) {
      case JobsStatus.OPEN_INDEFINITE:
      case JobsStatus.OPEN_UNTIL_EXPIRED:
      case JobsStatus.ON_HOLD:
      case JobsStatus.CLOSED:
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

export const NavMenuItemId = Object.freeze({
  NONE: "none",
  HOME: "home",
  ABOUT: "about",
  EVENTS: "events",
  PROJECTS: "projects",
  ALUMNI_DIRECTORY: "alumni-directory",
  NEWS: "news",
  JOBS: "jobs",
  ALUMNI: "alumni",
  ALUMNI_ACCESS: "alumni-access",
  ORGANIZATIONS: "organizations",
  ADMIN_HOME: "admin_home",
  ADMIN_ALUMNI: "admin_alumni",
  ADMIN_ALUMNI_DIRECTORY: "admin_alumni_directory",
  ADMIN_ALUMNI_ACCESS: "admin_alumni_access",
  ADMIN_EVENTS: "admin_events",
  ADMIN_JOBS: "admin_jobs",
  ADMIN_PROJECTS: "admin_projects",
  ADMIN_NEWS: "admin_news",
  ADMIN_ORGANIZATIONS: "admin_organizations"
});

export const DONATION_MODE_OF_PAYMENT = {
  PHYSICAL_PAYMENT: 0,
  BANK_TRANSFER: 1,
};

export const DONATION_MODE_OF_PAYMENT_LABELS = {
  [DONATION_MODE_OF_PAYMENT.PHYSICAL_PAYMENT]: "Physical",
  [DONATION_MODE_OF_PAYMENT.BANK_TRANSFER]: "Bank Transfer",
};

export const PROJECT_STATUS = {
  AWAITING_BUDGET: 0,
  ONGOING: 1,
  FINISHED: 2,
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.AWAITING_BUDGET]: "Awaiting Budget",
  [PROJECT_STATUS.ONGOING]: "Ongoing",
  [PROJECT_STATUS.FINISHED]: "Finished",
};

export const PROJECT_TYPE = {
  DONATION_DRIVE: "donation drive",
  FUNDRAISING: "fundraising",
  SCHOLARSHIP: "scholarship",
};

export const REQUEST_STATUS = {
  SENT: 0,
  APPROVED: 1,
  REJECTED: 2,
};

export const REQUEST_STATUS_LABELS = {
  [REQUEST_STATUS.SENT]: "Sent",
  [REQUEST_STATUS.APPROVED]: "Approved",
  [REQUEST_STATUS.REJECTED]: "Rejected",
};

export const SEX = {
  MALE: 1,
  FEMALE: 2,
};

export const SEX_LABELS = {
  [SEX.MALE]: "Male",
  [SEX.FEMALE]: "Female",
};

export const CIVIL_STATUS = {
  SINGLE: 0,
  MARRIED: 1,
  DIVORCED: 2,
  SEPARATED: 3,
  WIDOWED: 4,
};

export const CIVIL_STATUS_LABELS = {
  [CIVIL_STATUS.SINGLE]: "Single",
  [CIVIL_STATUS.MARRIED]: "Married",
  [CIVIL_STATUS.DIVORCED]: "Divorced",
  [CIVIL_STATUS.SEPARATED]: "Separated",
  [CIVIL_STATUS.WIDOWED]: "Widowed",
};

export const REQUEST_TYPE = {
  PROJECT_FUNDS: 0,
  FUNDRAISING: 1,
  OTHERS: 2,
};

const EventStatus = Object.freeze({
  OPEN: "open",
  CLOSED: "closed",
  CANCELLED: "cancelled",
  isDefined: function(aValue) {
    if (typeof aValue === "string" || aValue instanceof String) {
      const value = aValue.toLowerCase().trim();
      switch (value) {
      case EventStatus.OPEN:
      case EventStatus.CLOSED:
      case EventStatus.CANCELLED:
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

export const CONTACT_TYPE = {
  EMAIL: 0,
  PHONE: 1,
  DISCORD: 2,
  TELEGRAM: 3,
  FACEBOOK: 4,
  LINKEDIN: 5,
  OTHER: 6,

  isDefined: function(type) {
    const typeInt = parseInt(type);
    return Object.values(this)
      .filter(value => typeof value === "number")
      .includes(typeInt);
  }
};

export const CONTACT_TYPE_LABELS = {
  [CONTACT_TYPE.EMAIL]: "Email",
  [CONTACT_TYPE.PHONE]: "Phone",
  [CONTACT_TYPE.DISCORD]: "Discord",
  [CONTACT_TYPE.TELEGRAM]: "Telegram",
  [CONTACT_TYPE.FACEBOOK]: "Facebook",
  [CONTACT_TYPE.LINKEDIN]: "LinkedIn",
  [CONTACT_TYPE.OTHER]: "Other"
};

export const CONTACT_TYPE_ICONS = { [CONTACT_TYPE.EMAIL]: Mail, [CONTACT_TYPE.PHONE]: Phone, [CONTACT_TYPE.DISCORD]: MessageCircle, [CONTACT_TYPE.TELEGRAM]: Send, [CONTACT_TYPE.FACEBOOK]: Facebook, [CONTACT_TYPE.LINKEDIN]: Linkedin, [CONTACT_TYPE.OTHER]: HelpCircle };

// FIXME: This is a temporary solution.
// We need to get the degree programs from the backend.
// For now, we are hardcoding the degree programs.
export const kICSDegreePrograms = [
  {
    name: "BS Computer Science",
    level: "Bachelor of Science",
    institution: "University of the Philippines Los Baños",
  },
  {
    name: "MS Computer Science",
    level: "Master of Science",
    institution: "University of the Philippines Los Baños",
  },
  {
    name: "Master of Information Technology",
    level: "Master of Science",
    institution: "University of the Philippines Los Baños",
  },
  {
    name: "PhD Computer Science",
    level: "Doctor of Philosophy",
    institution: "University of the Philippines Los Baños",
  },
];

export {
  RoleName,
  Subjects,
  Actions,
  PhotoType,
  EmploymentStatus,
  EventStatus,
  JobsStatus,
};
