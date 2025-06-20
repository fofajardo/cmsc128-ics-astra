"use client";

import {createContext, useContext, useEffect, useState,} from "react";
import {createMongoAbility} from "@casl/ability";
import {RoleName} from "../../common/scopes.js";
import axios from "axios";
import {clientRoutes} from "../../common/routes.js";
import httpStatus from "http-status-codes";
import {useParams} from "next/navigation.js";

function buildUserContext() {
  const [initialized, setInitialized] = useState(false);
  const [routeInitialized, setRouteInitialized] = useState(true);
  const [isMinimal, setIsMinimal] = useState(false);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [degreePrograms, setDegreePrograms] = useState(null);
  const [degreeProofUploaded, setDegreeProofUploaded] = useState(false);
  const [degreeProofUrl, setDegreeProofUrl] = useState("https://cdn-icons-png.flaticon.com/512/8373/8373460.png");
  const [workExperiences, setWorkExperiences] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [organizationAffiliations, setOrganizationAffiliations] = useState(null);
  const [organizations, setOrganizations] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("https://cdn-icons-png.flaticon.com/512/145/145974.png");

  const [rules, setRules] = useState(null);
  const [ability, setAbility] = useState(null);

  const [authUser, setAuthUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isUnlinked, setIsUnlinked] = useState(false);
  const [isAlumnus, setIsAlumnus] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleFriendlyName, setRoleFriendlyName] = useState(null);

  const [activeNavItem, setActiveNavItem] = useState(null);
  const [activeNavSubmenus, setActiveNavSubmenus] = useState({});

  const toggleNavSubmenu = (id) => {
    setActiveNavSubmenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return {
    state: {
      initialized,
      routeInitialized,
      isMinimal,
      user,
      authUser,
      profile,
      degreePrograms,
      degreeProofUploaded,
      degreeProofUrl,
      workExperiences,
      contacts,
      organizationAffiliations,
      organizations,
      avatarUrl,
      rules,
      ability,
      isGuest,
      isUnlinked,
      isAlumnus,
      isModerator,
      isAdmin,
      roleFriendlyName,
      get isVerified() {
        return profile?.approved;
      },
      activeNavItem,
      activeNavSubmenus,
    },
    actions: {
      setInitialized,
      setRouteInitialized,
      setIsMinimal,
      setUser,
      setAuthUser,
      setProfile,
      setDegreePrograms,
      setDegreeProofUploaded,
      setDegreeProofUrl,
      setWorkExperiences,
      setContacts,
      setOrganizationAffiliations,
      setOrganizations,
      setAvatarUrl,
      setRules,
      setAbility,
      setIsGuest,
      setIsUnlinked,
      setIsAlumnus,
      setIsModerator,
      setIsAdmin,
      setRoleFriendlyName,
      patchUser: function(updates) {
        const updatedUser = {
          ...user,
          ...updates
        };
        return setUser(updatedUser);
      },
      patchProfile: function(updates) {
        const updatedProfile = {
          ...profile,
          ...updates
        };
        return setProfile(updatedProfile);
      },
      patchDegreePrograms: function(index, updates) {
        const updatedDegreePrograms = [...degreePrograms];
        updatedDegreePrograms[index] = {
          ...updatedDegreePrograms[index],
          ...updates
        };
        return setDegreePrograms(updatedDegreePrograms);
      },
      pushDegreeProgram: function(degreeProgram) {
        const updatedDegreePrograms = [...degreePrograms];
        updatedDegreePrograms.push(degreeProgram);
        return setDegreePrograms(updatedDegreePrograms);
      },
      patchContacts: function(index, updates) {
        const updatedContacts = [...contacts];
        updatedContacts[index] = {
          ...updatedContacts[index],
          ...updates
        };
        return setContacts(updatedContacts);
      },
      pushContact: function(degreeProgram) {
        const updatedContacts = [...contacts];
        updatedContacts.push(degreeProgram);
        return setContacts(updatedContacts);
      },
      patchWorkExperiences: function(index, updates) {
        const updatedWorkExperiences = [...workExperiences];
        updatedWorkExperiences[index] = {
          ...updatedWorkExperiences[index],
          ...updates
        };
        return setWorkExperiences(updatedWorkExperiences);
      },
      pushWorkExperience: function(workExperience) {
        const updatedWorkExperiences = [...workExperiences];
        updatedWorkExperiences.push(workExperience);
        return setWorkExperiences(updatedWorkExperiences);
      },
      patchOrganizationAffiliations: function(index, updates) {
        const updatedOrganizationAffiliations = [...organizationAffiliations];
        updatedOrganizationAffiliations[index] = {
          ...updatedOrganizationAffiliations[index],
          ...updates
        };
        return setOrganizationAffiliations(updatedOrganizationAffiliations);
      },
      pushOrganizationAffiliation: function(organizationAffiliation) {
        const updatedOrganizationAffiliations = [...organizationAffiliations];
        updatedOrganizationAffiliations.push(organizationAffiliation);
        return setOrganizationAffiliations(updatedOrganizationAffiliations);
      },
      pushOrganization: function(organization) {
        const updatedOrganizations = [...organizations];
        updatedOrganizations.push(organization);
        return setOrganizations(updatedOrganizations);
      },
      resetAvatarUrl: function() {
        return setAvatarUrl(user.avatar_url);
      },
      setActiveNavItem,
      setActiveNavSubmenus,
      toggleNavSubmenu,
    },
  };
}

const UserContext = createContext({state: {}, actions: {}});

const SignedInUserContext = createContext({state: {}, actions: {}});

function useUser() {
  return useContext(UserContext);
}

function useSignedInUser() {
  return useContext(SignedInUserContext);
}

function UserProvider({children}) {
  const value = buildUserContext();
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

function SignedInUserProvider({children}) {
  const value = buildUserContext();
  return (
    <SignedInUserContext.Provider value={value}>
      {children}
    </SignedInUserContext.Provider>
  );
}

function updateRoleProperties(aUser, aContext) {
  switch (aUser?.role) {
  case RoleName.UNLINKED:
    aContext.actions.setIsGuest(false);
    aContext.actions.setIsUnlinked(true);
    aContext.actions.setIsAlumnus(false);
    aContext.actions.setIsModerator(false);
    aContext.actions.setIsAdmin(false);
    aContext.actions.setRoleFriendlyName("Unlinked");
    break;
  case RoleName.ALUMNUS:
    aContext.actions.setIsGuest(false);
    aContext.actions.setIsUnlinked(false);
    aContext.actions.setIsAlumnus(true);
    aContext.actions.setIsModerator(false);
    aContext.actions.setIsAdmin(false);
    aContext.actions.setRoleFriendlyName("Alumnus");
    break;
  case RoleName.MODERATOR:
    aContext.actions.setIsGuest(false);
    aContext.actions.setIsUnlinked(false);
    aContext.actions.setIsAlumnus(false);
    aContext.actions.setIsModerator(true);
    aContext.actions.setIsAdmin(false);
    aContext.actions.setRoleFriendlyName("Moderator");
    break;
  case RoleName.ADMIN:
    aContext.actions.setIsGuest(false);
    aContext.actions.setIsUnlinked(false);
    aContext.actions.setIsAlumnus(false);
    aContext.actions.setIsModerator(false);
    aContext.actions.setIsAdmin(true);
    aContext.actions.setRoleFriendlyName("Admin");
    break;
  default:
    aContext.actions.setIsGuest(true);
    aContext.actions.setIsUnlinked(false);
    aContext.actions.setIsAlumnus(false);
    aContext.actions.setIsModerator(false);
    aContext.actions.setIsAdmin(false);
    aContext.actions.setRoleFriendlyName("Guest");
    break;
  }
}

async function fetchData(aUser, aContext, aIsMinimal) {
  aContext.actions.setIsMinimal(aIsMinimal);
  if (aUser === null || aUser === undefined || aUser === "") {
    aContext.actions.setUser(null);
    aContext.actions.setProfile(null);
    aContext.actions.setDegreePrograms(null);
    aContext.actions.setDegreeProofUploaded(false);
    aContext.actions.setContacts(null);
    aContext.actions.setInitialized(true);
    updateRoleProperties(aUser, aContext);
    return;
  }

  if (aUser) {
    if (aUser.public_metadata) {
      aContext.actions.setAuthUser(aUser);
      const rawUser = await axios.get(clientRoutes.users.getOne(aUser.id));
      aUser = rawUser?.data?.user;
    } else {
      aUser = aUser.user;
    }
    try {
      const profile = await axios.get(clientRoutes.users.getLatestAlumniProfile(aUser.id));
      aContext.actions.setProfile(profile?.data?.alumniProfile);
    } catch (e) {
      // Ignore missing profile.
    }
    try {
      const degreePrograms = await axios.get(clientRoutes.users.getOneDegreePrograms(aUser.id));
      aContext.actions.setDegreePrograms(degreePrograms?.data?.degreePrograms);
    } catch (e) {
      // Ignore missing degree programs.
    }

    if (aIsMinimal) {
      try {
        const degreeProofJson = await axios.get(clientRoutes.photos.getDegreeProofJson(aUser.id));
        aContext.actions.setDegreeProofUploaded(degreeProofJson.status === httpStatus.OK);
      } catch (e) {
        // Ignore missing degree proof.
      }
      aContext.actions.setContacts(null);
      aContext.actions.setDegreeProofUrl(null);
      aContext.actions.setWorkExperiences(null);
      aContext.actions.setOrganizationAffiliations(null);
      aContext.actions.setOrganizations(null);
    } else {
      try {
        const degreeProof = await axios.get(clientRoutes.photos.getDegreeProof(aUser.id));
        aContext.actions.setDegreeProofUploaded(degreeProof.status === httpStatus.OK);
        aContext.actions.setDegreeProofUrl(degreeProof?.data?.photo);
      } catch (e) {
        aContext.actions.setDegreeProofUrl("https://cdn-icons-png.flaticon.com/512/8373/8373460.png");
        // Ignore missing degree proof.
      }
      try {
        const workExperiences = await axios.get(clientRoutes.users.getWorkExperiences(aUser.id));
        aContext.actions.setWorkExperiences(workExperiences?.data?.work_experiences);
      } catch (e) {
        // Ignore missing work experiences.
      }
      try {
        const contacts = await axios.get(clientRoutes.users.getContacts(aUser.id));
        aContext.actions.setContacts(contacts?.data?.contacts);
      } catch (e) {
        // Ignore missing contacts.
      }
      try {
        const affiliations = await axios.get(clientRoutes.users.getOrganizations(aUser.id));
        aContext.actions.setOrganizationAffiliations(affiliations?.data?.affiliated_organizations);
      } catch (e) {
        // Ignore missing organization affiliations.
      }
      try {
        const organizations = await axios.get(clientRoutes.organizations.base());
        aContext.actions.setOrganizations(organizations?.data?.organization);
      } catch (e) {
        // Ignore missing organizations.
      }
    }
    updateRoleProperties(aUser, aContext);
  }
  if (aUser.scopes) {
    const ability = createMongoAbility(aUser.scopes);
    aContext.actions.setAbility(ability);
  }
  aContext.actions.setRules(aUser.scopes);
  delete aUser.scopes;
  aContext.actions.setUser(aUser);
  aContext.actions.setAvatarUrl(aUser.avatar_url);
  aContext.actions.setInitialized(true);
}

function useRefetchUser(aContext, aUserId = null, aIsMinimal = true) {
  const user = aUserId == null
    ? axios.get(clientRoutes.auth.signedInUser())
    : axios.get(clientRoutes.users.getOne(aUserId));

  return user.then(function (aUser) {
    return fetchData(aUser?.data, aContext, aIsMinimal);
  }).catch(function (e) {
    // User likely has a bad internet connection, has already signed
    // out from another tab, or something else.
  });
}

function UserFetcher({userId = null, inferId = null, isMinimal = true}) {
  const context = useUser();

  if (inferId !== null) {
    const params = useParams();
    userId = params[inferId];
  }

  useEffect(function () {
    useRefetchUser(context, userId, isMinimal);
  }, []);
}

function SignedInUserFetcher() {
  const context = useSignedInUser();

  useEffect(function () {
    useRefetchUser(context);
  }, []);
}

export {
  UserFetcher, UserProvider, useUser, useRefetchUser,
  SignedInUserFetcher, SignedInUserProvider, useSignedInUser,
};
