import {useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";



export default function Navbar() {

  const {user} = useAuth();
  const navigate = useNavigate();

  return <nav className="bg-[#0F0F0F] fixed h-16 w-full  select-none">
    <div className="flex h-full justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="font-unbounded text-3xl font-[700] text-white" onClick={() => navigate("/")}>StuxDev</div>

      <div className="h-full w-auto flex items-center justify-between gap-8 font-mono">

        <div className="text-white cursor-pointer underline-hover">About Us</div>
        { user ? (
          <>
          <span className="text-green-300">Hello, {user.first_name}</span>
          
          </>

        ) : (
          <div className="text-white cursor-pointer underline-hover" onClick={() => navigate("/login")}>
            Login & Register
          </div>)
        
        }
        

      </div>

    </div>


  </nav>
}
