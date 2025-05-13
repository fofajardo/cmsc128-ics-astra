"use client";

import {useSignedInUser} from "@/components/UserContext.jsx";
import {useLayoutEffect, useState} from "react";
import {redirect} from "next/navigation";
import {feRoutes} from "../../common/routes.js";
import {RouteGuardMode} from "../../common/scopes.js";

const RouteGuardStatus = Object.freeze({
  WAITING: 0,
  NO_REDIRECT: -1,
});

export function RouteGuard({component, isBlocking, mode, onChange}) {
  const [visible, setVisible] = useState(isBlocking === undefined ? false : !isBlocking);
  const requireAdmin = mode === RouteGuardMode.AUTHENTICATED_ADMIN;
  const requireAuthenticated = mode === RouteGuardMode.AUTHENTICATED || requireAdmin;
  const requireUnauthenticated = mode === RouteGuardMode.UNAUTHENTICATED;

  const userContext = useSignedInUser();

  const handleRedirect = function() {
    if (!userContext.state.initialized) {
      userContext.actions.setRouteInitialized(false);
      return RouteGuardStatus.WAITING;
    }

    if (requireAuthenticated && requireUnauthenticated) {
      throw new Error("Cannot use both requireAuthenticated and requireUnauthenticated");
    }

    // Block alumnus if they don't have a profile yet.
    if (mode !== RouteGuardMode.AUTHENTICATED_SIGN_UP) {
      if (userContext.state.isAlumnus && !userContext.state.profile) {
        return feRoutes.auth.signUp();
      }
    }

    if (requireAdmin) {
      if (!userContext.state.isAdmin) {
        return feRoutes.main.home();
      }
    }

    // Page requires the user to be authenticated.
    if (requireAuthenticated) {
      // ... and we're a guest, ask them to sign in.
      if (userContext.state.isGuest) {
        return feRoutes.auth.signIn();
      }
    }

    // Page requires the user to NOT be authenticated.
    if (requireUnauthenticated) {
      // ... and we're signed in.
      if (!userContext.state.isGuest) {
        return feRoutes.main.home();
      }
    }

    if (onChange) {
      const changeResult = onChange(userContext);
      if (typeof changeResult === "string" || changeResult instanceof String) {
        return changeResult;
      }
    }

    userContext.actions.setRouteInitialized(true);

    return RouteGuardStatus.NO_REDIRECT;
  };

  useLayoutEffect(() => {
    const result = handleRedirect();
    if (result === RouteGuardStatus.WAITING) {
      return;
    } else if (result !== RouteGuardStatus.NO_REDIRECT) {
      return redirect(result);
    }
    setVisible(true);
  }, [userContext.state]);

  if (visible) {
    return component;
  }

  return <div className="w-screen h-screen"></div>;
}
