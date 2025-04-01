


export default function Navbar() {



    return <nav className="bg-[#030303] fixed h-16 w-full border-b border-[#3C3C3C] select-none">
        <div className="flex h-full justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
            <div className="font-unbounded text-3xl font-[700] text-white ">StuxDev</div>

            <div className="h-full w-auto flex items-center justify-between gap-8 font-mono">
                
                <div className="text-white cursor-pointer underline-hover">Contact Us</div>

                <div className="text-white cursor-pointer underline-hover">Contact Us</div>
                <div className="text-white cursor-pointer underline-hover">About Us</div>
                <div className="text-white cursor-pointer underline-hover">
                    Login & Register
                </div>
                
               
            </div>
 
        </div>
        


    </nav>
}