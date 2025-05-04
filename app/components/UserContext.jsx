"use client";

import {createContext, useContext, useEffect, useState,} from "react";
import {createMongoAbility} from "@casl/ability";
import {RoleName} from "../../common/scopes.js";
import axios from "axios";
import {clientRoutes} from "../../common/routes.js";

function buildUserContext() {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [rules, setRules] = useState(null);
  const [ability, setAbility] = useState(null);

  const [authUser, setAuthUser] = useState(null);
  const [isUnlinked, setIsUnlinked] = useState(false);
  const [isAlumnus, setIsAlumnus] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return {
    state: {
      initialized,
      user,
      authUser,
      profile,
      rules,
      ability,
      isUnlinked,
      isAlumnus,
      isModerator,
      isAdmin
    },
    actions: {
      setInitialized,
      setUser,
      setAuthUser,
      setProfile,
      setRules,
      setAbility,
      setIsUnlinked,
      setIsAlumnus,
      setIsModerator,
      setIsAdmin
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

function fetchData(aUser, aContext) {
  if (aUser === null || aUser === undefined || aUser === "") {
    aContext.actions.setUser(null);
    aContext.actions.setProfile(null);
    aContext.actions.setInitialized(true);
    return;
  }

  if (aUser) {
    if (aUser.public_metadata) {
      const authUser = aUser;
      aUser = authUser.public_metadata;
      delete authUser.public_metadata;
      aContext.actions.setAuthUser(authUser);
    }
    axios.get(clientRoutes.alumniProfiles.base(`/${aUser.id}`)).then(function (aProfile) {
      aContext.actions.setProfile(aProfile);
    }).catch(function (e) {
      // Ignore missing profile.
    });
    switch (aUser.role) {
    case RoleName.UNLINKED:
      aContext.actions.setIsUnlinked(true);
      break;
    case RoleName.ALUMNUS:
      aContext.actions.setIsAlumnus(true);
      break;
    case RoleName.MODERATOR:
      aContext.actions.setIsModerator(true);
      break;
    case RoleName.ADMIN:
      aContext.actions.setIsAdmin(true);
      break;
    }
  }
  if (aUser.scopes) {
    const ability = createMongoAbility(aUser.scopes);
    aContext.actions.setAbility(ability);
  }
  aContext.actions.setRules(aUser.scopes);
  delete aUser.scopes;
  aContext.actions.setUser(aUser);
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
