import {Outlet, useLocation} from "react-router-dom";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

export default function Layout() {
    const location = useLocation();
    const hideNavbarRoutes = ["/login", "/signUp", "/payment", "/login/restorePassword"];
    const hideFooterRoutes = ["/login", "/signUp", "/payment", "/login/restorePassword"]; 
    return (
        <>
            {!hideNavbarRoutes.includes(location.pathname) && <Header/>}
            <Outlet  />
            {!hideFooterRoutes.includes(location.pathname) && <Footer />}
        </>
    );
}