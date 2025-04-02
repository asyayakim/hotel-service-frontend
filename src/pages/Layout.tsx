import {Outlet} from "react-router-dom";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

export default function Layout() {
    const hideNavbarRoutes = ["/login", "/signUp"];
    const hideFooterRoutes = ["/login", "/signUp"];
    return (
        <>
            {!hideNavbarRoutes.includes(location.pathname) && <Header/>}
            <Outlet  />
            {!hideFooterRoutes.includes(location.pathname) && <Footer />}
        </>
    );
}