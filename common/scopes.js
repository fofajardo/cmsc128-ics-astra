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
    USER: "User",
    ALUMNI_PROFILE: "AlumniProfile",
    CONTENT: "Content",
    JOB: "Job",
    EVENT: "Event",
    EVENT_INTEREST: "EventInterest",
    PROJECT: "Project",
    REPORT: "Report",
    REQUEST: "Request",
    CONTACT: "Contact",
    DONATION: "Donation",
    ORGANIZATION: "Organization",
    // Organization affiliation is implied by alumni profile.
    PHOTO: "Photo",
    DEGREE_PROGRAM: "DegreeProgram",
    // Degree programs taken is implied by alumni profile.
    WORK_EXPERIENCE: "WorkExperience",
});

const Actions = Object.freeze({
    CREATE: "create",
    READ: "read",
    MANAGE: "manage",
});

export { RoleName, Subjects, Actions };
