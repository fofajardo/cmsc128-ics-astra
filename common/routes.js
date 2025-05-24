/**
 * Represents a class for defining base routes used in an application.
 * Provides structured endpoints for various API resources relative to a base URL.
 */
class BaseRoutes {
  constructor() {
    this.buildEndpoints();
  }

  get BASE_URL() {
    return "";
  }

  /**
   * Initializes and constructs endpoint-related functions for various resources,
   * categorized into groups such as authentication, users, events, and more.
   * Each group contains a `base` method and additional resource-specific methods
   * as applicable for constructing URLs dynamically.
   *
   * @return {void} This method does not return a value; it populates dynamically
   * constructed endpoint functions as properties on the instance.
   */
  buildEndpoints() {
    this.auth = {
      base: (append = "") => `${this.BASE_URL}/auth${append}`,
      signUp: () => `${this.BASE_URL}/auth/sign-up`,
      signUpResendEmail: () => `${this.BASE_URL}/auth/sign-up/email/resend`,
      signIn: () => `${this.BASE_URL}/auth/sign-in`,
      signInExternal: (aProvider) => `${this.BASE_URL}/auth/sign-in/external?provider=${aProvider}`,
      signInExternalCallback: () => `${this.BASE_URL}/auth/sign-in/external/callback`,
      signInConfirm: () => `${this.BASE_URL}/auth/confirm`,
      signedInUser: () => `${this.BASE_URL}/auth/signed-in-user`,
      signOut: () => `${this.BASE_URL}/auth/sign-out`
    };

    this.workExperiences = {
      base: (append = "") => `${this.BASE_URL}/work-experiences${append}`,
    };

    this.users = {
      base: (append = "") => `${this.BASE_URL}/users${append}`,
      getOne: (id) => `${this.BASE_URL}/users/${id}`,
      getOneDegreePrograms: (id) => `${this.BASE_URL}/users/${id}/degree-programs`,
      getLatestAlumniProfile: (id) => `${this.BASE_URL}/users/${id}/profile/latest`,
      getAlumniProfiles: (id) => `${this.BASE_URL}/users/${id}/profile`,
      getWorkExperiences: (id) => `${this.BASE_URL}/users/${id}/work-experiences`,
      getOrganizations: (id) => `${this.BASE_URL}/users/${id}/organizations`,
      getAvatar: (id) => `${this.BASE_URL}/users/${id}/avatar`,
    };

    this.degreePrograms = {
      base: (append = "") => `${this.BASE_URL}/degree-programs${append}`,
    };

    this.photos = {
      base: (append = "") => `${this.BASE_URL}/photos${append}`,
      withId: (id) => `${this.BASE_URL}/photos/${id}`,
      getByProject: (projectId) => `${this.BASE_URL}/photos/project/${projectId}`,
      getByEvent: (contentId) => `${this.BASE_URL}/photos/event/${contentId}`,
      getByAlum: (alumId) => `${this.BASE_URL}/photos/alum/${alumId}`,
      getProfilePics: () => `${this.BASE_URL}/photos/profile-pics`,
      getDegreeProof: (alumId) => `${this.BASE_URL}/photos/degree-proof/${alumId}`,
      getDegreeProofJson: (alumId) => `${this.BASE_URL}/photos/degree-proof/${alumId}/json`
    };

    this.alumniProfiles = {
      base: (append = "") => `${this.BASE_URL}/alumni-profiles${append}`,
      withId: (id) => `${this.BASE_URL}/alumni-profiles/${id}`,
    };

    this.contents = {
      base: (append = "") => `${this.BASE_URL}/contents${append}`,
    };

    this.events = {
      base: (append = "") => `${this.BASE_URL}/events${append}`,
    };

    this.eventInterests = {
      base: (append = "") => `${this.BASE_URL}/event-interests${append}`,
    };

    this.projects = {
      base: (append = "") => `${this.BASE_URL}/projects${append}`,
    };

    this.donations = {
      base: (append = "") => `${this.BASE_URL}/donations${append}`,
    };

    this.organizations = {
      base: (append = "") => `${this.BASE_URL}/organizations${append}`,
    };

    this.organizationAffiliations = {
      base: (append = "") => `${this.BASE_URL}/organization-affiliations${append}`,
    };

    this.reports = {
      base: (append = "") => `${this.BASE_URL}/reports${append}`,
    };

    this.requests = {
      base: (append = "") => `${this.BASE_URL}/requests${append}`,
    };

    this.jobs = {
      base: (append = "") => `${this.BASE_URL}/jobs${append}`,
    };


    this.statistics = {
      base: (append = "") => `${this.BASE_URL}/statistics${append}`
    };

    this.announcements = {
      base: (append = "") => `${this.BASE_URL}/announcements${append}`,
    };

    this.email = {
      base: (append = "") => `${this.BASE_URL}/email${append}`
    };
  }
}

/**
 * Server Routes for back-end use.
 */
class ServerRoutes extends BaseRoutes {
  constructor() {
    super();
  }

  get BASE_URL() {
    return "/v1";
  }
}

/**
 * Client Routes for front-end use.
 */
class ClientRoutes extends BaseRoutes {
  constructor() {
    super();
  }

  get BASE_URL() {
    return process.env.NEXT_PUBLIC_API_URL + "/v1";
  }
}

/**
 * Client Routes for tests use.
 */
class TestRoutes extends BaseRoutes {
  constructor() {
    super();
  }

  get BASE_URL() {
    return process.env.ICSA_API_URL + "/v1";
  }
}

class FrontEndRoutes extends BaseRoutes {
  constructor(aIsAbsolute) {
    super();
    this.isAbsolute = aIsAbsolute;
  }

  get BASE_URL() {
    return this.isAbsolute ? process.env.NEXT_PUBLIC_ICSA_FE_URL : "";
  }

  /**
   * Initializes and constructs route mappings for various front-end pages.
   * Each key represents a logical route name, and the value is the actual URL path.
   * This helps in centralizing and easily managing front-end navigation URLs.
   *
   * @return {void} This method does not return a value; it populates dynamically
   * constructed route paths as properties on the instance.
   */
  buildEndpoints() {
    this.auth = {
      signUp: () => `${this.BASE_URL}/sign-up`,
      signIn: () => `${this.BASE_URL}/sign-in`,
      signOut: () => `${this.BASE_URL}/sign-out`
    };

    this.main = {
      home: () => `${this.BASE_URL}/`,
      about: () => `${this.BASE_URL}/about`,
      search: () => `${this.BASE_URL}/search`,
      settings: () => `${this.BASE_URL}/settings`,
      check: () => `${this.BASE_URL}/check`
    };

    this.events = {
      base: () => `${this.BASE_URL}/events`
    };

    this.projects = {
      base: () => `${this.BASE_URL}/projects`,
      about: (id) => `${this.BASE_URL}/projects/about/${id}`,
      donate: (id) => `${this.BASE_URL}/projects/donate/${id}`,
      request: {
        goal: () => `${this.BASE_URL}/projects/request/goal`,
        details: () => `${this.BASE_URL}/projects/request/details`,
        photo: () => `${this.BASE_URL}/projects/request/photo`,
        preview: () => `${this.BASE_URL}/projects/request/preview`
      }
    };

    this.announcements = {
      base: () => `${this.BASE_URL}/whats-up`,
      view: (id) => `${this.BASE_URL}/whats-up/article/${id}`,
      requestInfo: () => `${this.BASE_URL}/whats-up/request-info`
    };

    this.jobs = {
      base: () => `${this.BASE_URL}/jobs`,
      view: (id) => `${this.BASE_URL}/jobs/${id}/view`,
      edit: (id) => `${this.BASE_URL}/jobs/${id}/edit`
    };

    this.admin = {
      dashboard: () => `${this.BASE_URL}/admin/dashboard`,
      alumni: {
        search: () => `${this.BASE_URL}/admin/alumni/search`,
        manageAccess: () => `${this.BASE_URL}/admin/alumni/manage-access`
      },
      events: () => `${this.BASE_URL}/admin/events`,
      jobs: () => `${this.BASE_URL}/admin/jobs`,
      projects: () => `${this.BASE_URL}/admin/projects`,
      announcements: () => `${this.BASE_URL}/admin/whats-up`,
      organizations: () => `${this.BASE_URL}/admin/organizations`
    };
  }
}

export const serverRoutes = new ServerRoutes();
export const clientRoutes = new ClientRoutes();
export const testRoutes = new TestRoutes();
export const feRoutes = new FrontEndRoutes(false);
export const absFeRoutes = new FrontEndRoutes(true);

Object.freeze(serverRoutes);
Object.freeze(clientRoutes);
Object.freeze(testRoutes);
Object.freeze(feRoutes);
Object.freeze(absFeRoutes);
