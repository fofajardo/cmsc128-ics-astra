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
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [degreePrograms, setDegreePrograms] = useState(null);
  const [degreeProofUploaded, setDegreeProofUploaded] = useState(false);
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
      user,
      authUser,
      profile,
      degreePrograms,
      degreeProofUploaded,
      avatarUrl,
      rules,
      ability,
      isGuest,
      isUnlinked,
      isAlumnus,
      isModerator,
      isAdmin,
      activeNavItem,
      activeNavSubmenus,
    },
    actions: {
      setInitialized,
      setRouteInitialized,
      setUser,
      setAuthUser,
      setProfile,
      setDegreePrograms,
      setDegreeProofUploaded,
      setAvatarUrl,
      setRules,
      setAbility,
      setIsGuest,
      setIsUnlinked,
      setIsAlumnus,
      setIsModerator,
      setIsAdmin,
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

async function fetchData(aUser, aContext) {
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
      const rawUser = await axios.get(clientRoutes.users.base(`/${aUser.id}`));
      aUser = rawUser?.data?.user;
    }
    try {
      const rawProfile = await axios.get(clientRoutes.alumniProfiles.base(`/${aUser.id}`));
      aContext.actions.setProfile(rawProfile?.data?.alumniProfile);
    } catch (e) {
      // Ignore missing profile.
    }

    try {
      const rawDegreePrograms = await axios.get(clientRoutes.users.getOneDegreePrograms(aUser.id));
      aContext.actions.setDegreePrograms(rawDegreePrograms?.data?.degreePrograms);
    } catch (e) {
      // Ignore missing degree programs.
    }

    try {
      const rawDegreeProof = await axios.get(clientRoutes.photos.getDegreeProofJson(aUser.id));
      aContext.actions.setDegreeProofUploaded(rawDegreeProof.status === httpStatus.OK);
    } catch (e) {
      // Ignore missing degree proof.
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

function useRefetchUser(aContext, aUserId = null) {
  const user = aUserId == null
    ? axios.get(clientRoutes.auth.signedInUser())
    : axios.get(clientRoutes.users.base(`/${aUserId}`));

  return user.then(function (aUser) {
    return fetchData(aUser?.data, aContext);
  }).catch(function (e) {
    // User likely has a bad internet connection, has already signed
    // out from another tab, or something else.
  });
}

function UserFetcher({userId = null}) {
  const context = useUser();

  useEffect(function () {
    useRefetchUser(context, userId);
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
