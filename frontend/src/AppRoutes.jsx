import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Menubar from "./components/Menubar";
import Home from "./pages/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import BlogPage from "./pages/BlogPage";
import CreateBlog from "./pages/UpsertBlogPostPage";
import UpsertBlogPostPage from "./pages/UpsertBlogPostPage";
import Profile from "./pages/Profile";

function AppRoutes() {
    const location = useLocation();
    const authPages = ["/login", "/register"]; // <-- Added register here
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
                    <Route path="/register" element={<Register />} /> {/* <-- Added this */}
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

                    <Route path="/blog/edit/:blogId"
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
