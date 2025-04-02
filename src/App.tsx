import {Route, Routes} from "react-router-dom";
import './App.css'
import Layout from "./pages/Layout";
import MainView from "./pages/MainView.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";




export default function App() {
  return (
    <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<MainView />} />
            <Route path="signUp" element={<SignUp />} />
            <Route path="login" element={<Login />} />
            {/*<Route path="user" element={<UserPage />} />*/}
            <Route path="*" element={<p>404 - Page not found</p>} />
        </Route>
    </Routes>
  )
}



