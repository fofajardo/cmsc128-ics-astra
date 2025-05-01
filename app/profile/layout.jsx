import "../styles/globals.css";
import "../styles/styles.css";
import HeaderUser from "../components/HeaderUser.jsx";

export default function RootLayout({ children }) {
  return (
    <>
      <HeaderUser />
      <main>{children}</main>
    </>
  );
}
