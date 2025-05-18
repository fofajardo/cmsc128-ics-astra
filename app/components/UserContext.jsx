"use client";

import {createContext, useContext, useEffect, useState,} from "react";
import {createMongoAbility} from "@casl/ability";
import {RoleName} from "../../common/scopes.js";
import axios from "axios";
import {clientRoutes} from "../../common/routes.js";
import httpStatus from "http-status-codes";

function buildUserContext() {
  const [initialized, setInitialized] = useState(false);
  const [routeInitialized, setRouteInitialized] = useState(true);
  const [isMinimal, setIsMinimal] = useState(false);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [degreePrograms, setDegreePrograms] = useState(null);
  const [degreeProofUploaded, setDegreeProofUploaded] = useState(false);
  const [degreeProofUrl, setDegreeProofUrl] = useState(null);
  const [workExperiences, setWorkExperiences] = useState(null);
  const [organizationAffiliations, setOrganizationAffiliations] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("https://cdn-icons-png.flaticon.com/512/145/145974.png");

  const [rules, setRules] = useState(null);
  const [ability, setAbility] = useState(null);

  const [authUser, setAuthUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isUnlinked, setIsUnlinked] = useState(false);
  const [isAlumnus, setIsAlumnus] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
      organizationAffiliations,
      avatarUrl,
      rules,
      ability,
      isGuest,
      isUnlinked,
      isAlumnus,
      isModerator,
      isAdmin,
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
      setOrganizationAffiliations,
      setAvatarUrl,
      setRules,
      setAbility,
      setIsGuest,
      setIsUnlinked,
      setIsAlumnus,
      setIsModerator,
      setIsAdmin,
      patchUser: function(key, value) {
        const updatedUser = {
          ...user,
          [key]: value,
        };
        return setUser(updatedUser);
      },
      patchProfile: function(key, value) {
        const updatedProfile = {
          ...profile,
          [key]: value,
        };
        return setProfile(updatedProfile);
      },
      patchDegreePrograms: function(index, value) {
        const updatedDegreePrograms = degreePrograms;
        updatedDegreePrograms[index] = value;
        return setDegreePrograms(updatedDegreePrograms);
      },
      patchWorkExperiences: function(index, value) {
        const updatedWorkExperiences = workExperiences;
        updatedWorkExperiences[index] = value;
        return setWorkExperiences(updatedWorkExperiences);
      },
      patchOrganizationAffiliations: function(index, value) {
        const updatedOrganizationAffiliations = organizationAffiliations;
        updatedOrganizationAffiliations[index] = value;
        return setOrganizationAffiliations(updatedOrganizationAffiliations);
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
    break;
  case RoleName.ALUMNUS:
    aContext.actions.setIsGuest(false);
    aContext.actions.setIsUnlinked(false);
    aContext.actions.setIsAlumnus(true);
    aContext.actions.setIsModerator(false);
    aContext.actions.setIsAdmin(false);
    break;
  case RoleName.MODERATOR:
    aContext.actions.setIsGuest(false);
    aContext.actions.setIsUnlinked(false);
    aContext.actions.setIsAlumnus(false);
    aContext.actions.setIsModerator(true);
    aContext.actions.setIsAdmin(false);
    break;
  case RoleName.ADMIN:
    aContext.actions.setIsGuest(false);
    aContext.actions.setIsUnlinked(false);
    aContext.actions.setIsAlumnus(false);
    aContext.actions.setIsModerator(false);
    aContext.actions.setIsAdmin(true);
    break;
  default:
    aContext.actions.setIsGuest(true);
    aContext.actions.setIsUnlinked(false);
    aContext.actions.setIsAlumnus(false);
    aContext.actions.setIsModerator(false);
    aContext.actions.setIsAdmin(false);
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
      aContext.actions.setDegreeProofUrl(null);
      aContext.actions.setWorkExperiences(null);
      aContext.actions.setOrganizationAffiliations(null);
    } else {
      try {
        const degreeProof = await axios.get(clientRoutes.photos.getDegreeProof(aUser.id));
        aContext.actions.setDegreeProofUploaded(degreeProof.status === httpStatus.OK);
        aContext.actions.setDegreeProofUrl(degreeProof?.data?.photo);
      } catch (e) {
        // Ignore missing degree proof.
      }
      try {
        const workExperiences = await axios.get(clientRoutes.users.getWorkExperiences(aUser.id));
        aContext.actions.setWorkExperiences(workExperiences?.data?.work_experiences);
      } catch (e) {
        // Ignore missing work experiences.
      }
      try {
        const affiliations = await axios.get(clientRoutes.users.getOrganizations(aUser.id));
        aContext.actions.setOrganizationAffiliations(affiliations?.data?.affiliated_organizations);
      } catch (e) {
        // Ignore missing organization affiliations.
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

function UserFetcher({userId = null, isMinimal = true}) {
  const context = useUser();

  useEffect(function () {
    useRefetchUser(context, userId, isMinimal);
  }, []);
}

function SignedInUserFetcher({isMinimal = true}) {
  const context = useSignedInUser();

  useEffect(function () {
    useRefetchUser(context);
  }, []);
}

export {
  UserFetcher, UserProvider, useUser, useRefetchUser,
  SignedInUserFetcher, SignedInUserProvider, useSignedInUser,
};
