import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Menubar from "./components/Menubar";
import Home from "./pages/Home";
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

function AppRoutes() {
    const location = useLocation();
    const authPages = ["/login"];
    const isAuthPage = authPages.includes(location.pathname);

    return (
        <>
            {!isAuthPage && <Navbar />}
            {!isAuthPage && <Menubar />}

            <div className={isAuthPage ? "" : "pt-28"}>
                <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </>
    );
}

export default AppRoutes;
