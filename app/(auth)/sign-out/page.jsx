"use client";

import LoadingOverlay from "@/components/LoadingOverlay.jsx";
import {useEffect} from "react";
import axios from "axios";
import {clientRoutes} from "../../../common/routes.js";
import {useRouter} from "next/navigation";
import {useRefetchUser, useSignedInUser} from "@/components/UserContext.jsx";

export default function SignOut() {
  const router = useRouter();
  const userContext = useSignedInUser();

  const handleSignOut = function() {
    axios.post(clientRoutes.auth.signOut(),
    ).then(function() {
      // Do nothing with the result.
    }).catch(function() {
      // Ignore errors.
    }).finally(function() {
      useRefetchUser(userContext).then(function () {
        return router.push("/");
      });
    });
  };

  useEffect(handleSignOut, []);

  return <LoadingOverlay loading={true} />;
}
