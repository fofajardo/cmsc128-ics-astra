import {useSignedInUser} from "@/components/UserContext.jsx";
import {useContext, useLayoutEffect} from "react";
import {redirect, useRouter} from "next/navigation";
import {feRoutes} from "../../common/routes.js";
import {RouteGuardMode} from "../../common/scopes.js";

export function RouteGuard({mode, onChange}) {
  const requireAuthenticated = mode === RouteGuardMode.RA;
  const requireUnauthenticated = mode === RouteGuardMode.RU;

  const userContext = useSignedInUser();

  const handleRedirect = function() {
    if (!userContext.state.initialized) {
      userContext.actions.setRouteInitialized(false);
      return -1;
    }

    if (requireAuthenticated && requireUnauthenticated) {
      throw new Error("Cannot use both requireAuthenticated and requireUnauthenticated");
    }

    // Block alumnus if they don't have a profile yet.
    if (mode !== RouteGuardMode.AUTH_SIGN_UP) {
      if (userContext.state.isAlumnus && !userContext.state.profile) {
        return feRoutes.auth.signUp();
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
      onChange(userContext);
    }

    userContext.actions.setRouteInitialized(true);

    return -1;
  };

  useLayoutEffect(() => {
    const result = handleRedirect();
    if (result !== -1) {
      redirect(result);
    }
  }, [userContext.state]);
}

export function RouteGuardAuthenticated() {
  return <RouteGuard mode={RouteGuardMode.RA} />;
}

export function RouteGuardUnauthenticated() {
  return <RouteGuard mode={RouteGuardMode.RU} />;
}
