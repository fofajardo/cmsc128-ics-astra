import "../styles/globals.css";
import "../styles/styles.css";
import NavbarUser from "../components/NavbarUser";

export default function RootLayout({ children }) {
  return (
    <>
      <NavbarUser />
      <main>{children}</main>
    </>
  );
}
