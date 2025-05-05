import Link from "next/link";
import {feRoutes} from "../../common/routes.js";
import {useSignedInUser} from "@/components/UserContext.jsx";

export default function AuthSignOutLink() {
  const userContext = useSignedInUser();

  return !userContext.state.isGuest && (
    <Link href={feRoutes.auth.signOut()} className="text-[var(--color-astraprimary)] text-sm md:text-base hover:underline">
      Sign Out
    </Link>
  );
}
