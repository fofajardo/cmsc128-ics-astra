import {RouteGuard} from "@/components/RouteGuard.jsx";
import {RouteGuardMode} from "../../../common/scopes.js";

export const metadata = {
  title: "Sign Up",
  description: "Create a new ICS-ASTRA account and join the community.",
};

export default function RootLayout({ children }) {
  return (
    <RouteGuard
      mode={RouteGuardMode.AUTHENTICATED_SIGN_UP}
      component={children}
    />
  );
}
