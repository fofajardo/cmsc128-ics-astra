"use client";

import LoadingOverlay from "@/components/LoadingOverlay.jsx";
import {useEffect} from "react";
import axios from "axios";
import {clientRoutes} from "../../../common/routes.js";
import {useRouter} from "next/navigation";

export default function SignOut() {
  const router = useRouter();

  const handleSignOut = function() {
    axios.post(clientRoutes.auth.signOut(),
    ).then(function() {
      router.push("/");
    });
  };

  useEffect(handleSignOut, []);

  return <LoadingOverlay loading={true} />;
}
