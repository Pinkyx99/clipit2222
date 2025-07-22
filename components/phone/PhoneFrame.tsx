import React from 'react';

const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="relative mx-auto border-black bg-black border-[14px] rounded-[2.5rem] h-[85vh] max-h-[926px] w-auto aspect-[9/19.5] shadow-2xl z-10">
            <div className="absolute top-0 w-[140px] h-[30px] left-1/2 -translate-x-1/2 bg-black rounded-b-xl z-20 flex justify-center items-end p-1">
                 <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
            </div>
            <div className="rounded-[1.75rem] overflow-hidden w-full h-full bg-black">
                {children}
            </div>
        </div>
    );
};

export default PhoneFrame;