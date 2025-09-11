import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import BlogPage from "./pages/BlogPage";
import UpsertBlogPostPage from "./pages/UpsertBlogPostPage";
import Profile from "./pages/Profile";

function AppRoutes() {
    const location = useLocation();
    const noNavPage = ["/login", "/register", "/profile"]; 
    const isNoNavPage = noNavPage.includes(location.pathname);

    return (
        <>
            {!isNoNavPage && <Navbar />}
   
    

            <div className={isNoNavPage ? "" : "pt-16"}>
                <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />


                    <Route path="/blog/:slug" element={<BlogPage/>} />

                    <Route path="/blog/new"
                            element = {
                                <ProtectedRoute>
                                    <UpsertBlogPostPage/>
                                </ProtectedRoute>
                            }
                    />

                    <Route path="/blog/edit/:blogSlug"
                            element = {
                                <ProtectedRoute>
                                    <UpsertBlogPostPage/>
                                </ProtectedRoute>
                            }
                    />

                    <Route path="/profile/:userId"
                            element = {
                                <ProtectedRoute>
                                    <Profile/>
                                </ProtectedRoute>
                            }
                    />
                </Routes>
            </div>
        </>
    );
}

export default AppRoutes;
