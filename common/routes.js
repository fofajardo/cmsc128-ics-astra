/**
 * URL Builder utility for API endpoints
 */
export class Routes {
  static BASE_URL = "/v1";

  /**
   *  Authentication URLs
   */
  static auth = {
    base: () => `${Routes.BASE_URL}/auth`,
    signUp: () => `${Routes.BASE_URL}/auth/sign-up`,
    signIn: () => `${Routes.BASE_URL}/auth/sign-in`,
    signInExternal: () => `${Routes.BASE_URL}/auth/sign-in-external`,
    signInExternalCallback: () => `${Routes.BASE_URL}/auth/sign-in-external/callback`,
    signedInUser: () => `${Routes.BASE_URL}/auth/signed-in-user`,
    signOut: () => `${Routes.BASE_URL}/auth/sign-out`
  };

  /**
   * Work Experiences URLs
   */
  static workExperiences = {
    base: () => `${Routes.BASE_URL}/work-experiences`,
    getAll: (page, limit) => {
      const url = `${Routes.BASE_URL}/work-experiences`;
      const params = new URLSearchParams();
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);
      return params.toString() ? `${url}?${params.toString()}` : url;
    },
    getById: (id) => `${Routes.BASE_URL}/work-experiences/${id}`,
    getByUserId: (userId) => `${Routes.BASE_URL}/work-experiences/alum/${userId}`,
    create: () => `${Routes.BASE_URL}/work-experiences`,
    update: (id) => `${Routes.BASE_URL}/work-experiences/${id}`,
    delete: (id) => `${Routes.BASE_URL}/work-experiences/${id}`
  };

  /**
   * Users URLs
   */
  static users = {
    base: () => `${Routes.BASE_URL}/users`
  };

  /**
   * Degree Programs URLs
   */
  static degreePrograms = {
    base: () => `${Routes.BASE_URL}/degree-programs`
  };

  /**
   * Photos URLs
   */
  static photos = {
    base: () => `${Routes.BASE_URL}/photos`
  };

  /**
   * Alumni Profiles URLs
   */
  static alumniProfiles = {
    base: () => `${Routes.BASE_URL}/alumni-profiles`
  };

  /**
   * Contents URLs
   */
  static contents = {
    base: () => `${Routes.BASE_URL}/contents`
  };

  /**
   * Events URLs
   */
  static events = {
    base: () => `${Routes.BASE_URL}/events`
  };

  /**
   * Event Interests URLs
   */
  static eventInterests = {
    base: () => `${Routes.BASE_URL}/event-interests`
  };

  /**
   * Projects URLs
   */
  static projects = {
    base: () => `${Routes.BASE_URL}/projects`
  };

  /**
   * Donations URLs
   */
  static donations = {
    base: () => `${Routes.BASE_URL}/donations`
  };

  /**
   * Organizations URLs
   */
  static organizations = {
    base: () => `${Routes.BASE_URL}/organizations`
  };

  /**
   * Organization Affiliations URLs
   */
  static organizationAffiliations = {
    base: () => `${Routes.BASE_URL}/organization-affiliations`
  };

  /**
   * Reports URLs
   */
  static reports = {
    base: () => `${Routes.BASE_URL}/reports`
  };

  /**
   * Requests URLs
   */
  static requests = {
    base: () => `${Routes.BASE_URL}/requests`
  };

  /**
   * Jobs URLs
   */
  static jobs = {
    base: () => `${Routes.BASE_URL}/jobs`
  };
}