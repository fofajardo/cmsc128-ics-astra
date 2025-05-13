import "../styles/globals.css";
import "../styles/styles.css";
import {Header} from "../components/Header.jsx";

export default function RootLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
