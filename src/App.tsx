import {Route, Routes} from "react-router-dom";
import './App.css'
import Layout from "./pages/Layout";
import MainView from "./pages/MainView.tsx";




export default function App() {
  return (
    <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<MainView />} />
            {/*<Route path="user" element={<UserPage />} />*/}
            <Route path="*" element={<p>404 - Page not found</p>} />
        </Route>
    </Routes>
  )
}



