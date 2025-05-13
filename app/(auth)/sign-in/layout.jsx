import {RouteGuard} from "@/components/RouteGuard.jsx";
import {RouteGuardMode} from "../../../common/scopes.js";

export const metadata = {
  title: "Sign In",
  description: "Access your ICS-ASTRA account securely.",
};

export default function RootLayout({ children }) {
  return (
    <RouteGuard
      mode={RouteGuardMode.UNAUTHENTICATED}
      component={children}
    />
  );
}
