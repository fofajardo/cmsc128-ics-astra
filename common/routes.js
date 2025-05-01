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
      signIn: () => `${this.BASE_URL}/auth/sign-in`,
      signInExternal: (aProvider) => `${this.BASE_URL}/auth/sign-in/external?provider=${aProvider}`,
      signInExternalCallback: () => `${this.BASE_URL}/auth/sign-in/external/callback`,
      signedInUser: () => `${this.BASE_URL}/auth/signed-in-user`,
      signOut: () => `${this.BASE_URL}/auth/sign-out`
    };

    this.workExperiences = {
      base: (append = "") => `${this.BASE_URL}/work-experiences${append}`,
    };

    this.users = {
      base: (append = "") => `${this.BASE_URL}/users${append}`,
    };

    this.degreePrograms = {
      base: (append = "") => `${this.BASE_URL}/degree-programs${append}`,
    };

    this.photos = {
      base: (append = "") => `${this.BASE_URL}/photos${append}`,
    };

    this.alumniProfiles = {
      base: (append = "") => `${this.BASE_URL}/alumni-profiles${append}`,
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
    super(process.env.ICSA_API_URL + "/v1");
  }
}

export const serverRoutes = new ServerRoutes();
export const clientRoutes = new ClientRoutes();
export const testRoutes = new TestRoutes();

Object.freeze(serverRoutes);
Object.freeze(clientRoutes);
Object.freeze(testRoutes);
