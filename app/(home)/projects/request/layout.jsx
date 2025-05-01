import {Suspense} from "react";

export default function RootLayout({ children }) {
  return (
    <Suspense>
      {children}
    </Suspense>
  );
}
