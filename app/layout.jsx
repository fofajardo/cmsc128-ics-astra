import { SignedInUserFetcher, SignedInUserProvider } from "./components/UserContext";
import PropTypes from "prop-types";
import {RootLoadingOverlay} from "@/components/LoadingOverlay.jsx";

export const metadata = {
  title: {
    template: "%s - ICS-ASTRA",
    default: "ICS-ASTRA",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <SignedInUserProvider>
          <SignedInUserFetcher />
          <RootLoadingOverlay />
          {children}
          <Toaster />
        </SignedInUserProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
