import React from "react";


const Menubar = () => {

    return (
        <div className="bg-[#1d1d1d] fixed h-12 mt-16 w-full  select-none">
            <div className="flex h-full justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="font-unbounded text-2xl font-[700] text-white ">
                    blog
                </div>

                <div className="h-full w-auto flex items-center justify-between gap-8 font-mono">
                    <div className="text-white cursor-pointer underline-hover">
                        Developer
                    </div>
                    <div className="text-white cursor-pointer underline-hover">
                        Culture
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menubar;
