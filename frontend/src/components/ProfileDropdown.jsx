import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";

function ProfileDropdown({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { logout } = useAuth();

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    const fullName = `${
        user.first_name.charAt(0).toUpperCase() +
        user.first_name.slice(1) +
        " " +
        user.last_name.charAt(0).toUpperCase() +
        user.last_name.slice(1)
    }`;

    const initials = `${
        user.first_name.charAt(0).toUpperCase() +
        user.last_name.charAt(0).toUpperCase()
    }`;

    const placeHolderUrl = `https://placehold.co/100x100/000000/FFFFFF?text=${initials}`;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* The button that triggers the dropdown */}
            <button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
            >
                <img
                    className="w-10 h-10 rounded-full border-2 border-gray-500 hover:border-[#14FFEC] transition-colors duration-300"
                    src={placeHolderUrl}
                    alt="User Avatar"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/100x100/CCCCCC/FFFFFF?text=U`;
                    }}
                />
            </button>

            {/* The Dropdown Menu */}
            {/* Uses a transition for a smooth fade-in/fade-out effect */}
            <div
                className={`
    absolute right-0 mt-2 w-56 origin-top-right bg-[#1d1d1d] border border-[#3C3C3C] rounded-lg shadow-xl overflow-hidden
    transition-all duration-300 ease-out
    ${
        isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
    }
  `}
            >
                {/* The p-1 gives the items space from the edge so the glow is visible */}
                <div className="p-1">
                    {/* User Info Section */}
                    <div className="px-3 py-2 border-b border-[#3C3C3C] mb-1 select-text">
                        <p className="text-sm font-semibold text-white">
                            {fullName}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                    </div>

                    {/* --- Menu Items with Subtle Glow Hover --- */}
                    <Link
                        to={`/profile/${user.id}`}
                        onClick={closeDropdown}
                        className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors duration-200"
                    >
                        <User className="w-4 h-4 mr-3" />
                        <span>Profile</span>
                    </Link>

                    <Link
                        to="/settings"
                        onClick={closeDropdown}
                        className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors duration-200"
                    >
                        <Settings className="w-4 h-4 mr-3" />
                        <span>Settings</span>
                    </Link>

                    {/* --- Log Out Item with Subtle Glow Hover --- */}
                    <button
                        type="button"
                        onClick={() => {
                            closeDropdown();
                            logout();
                        }}
                        className="flex items-center w-full px-3 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors duration-200"
                    >
                        <LogOut className="w-4 h-4 mr-3" />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
export default ProfileDropdown;
