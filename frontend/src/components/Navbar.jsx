import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import logo from "../assets/stuxdev-logo.svg"


export default function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    

    return (
        <nav className="bg-[#1A1A1A] fixed h-16 w-full border-b border-[#3C3C3C]  select-none z-50">
            <div className="flex h-full justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <Link to="/dashboard">
                    <img 
                    src={logo} 
                    alt="StuxDev Logo" 
                    className="h-10 w-auto"
                    />
                </Link>
                  
              

                <div className="h-full w-auto flex items-center justify-between gap-8 font-mono">
                    <div className="text-white cursor-pointer underline-hover">
                        About Us
                    </div>
                    {user ? (
                        <>
                            <ProfileDropdown user={user} />
                        </>
                    ) : (
                        <div
                            className="text-white cursor-pointer underline-hover"
                            onClick={() => navigate("/login")}
                        >
                            Login 
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
