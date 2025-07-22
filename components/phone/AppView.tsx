import React from 'react';

interface AppViewProps {
    title: string;
    goHome: () => void;
    children: React.ReactNode;
}

const AppView: React.FC<AppViewProps> = ({ title, goHome, children }) => {
    return (
        <div className="w-full h-full flex flex-col bg-gray-900 text-gray-100 animate-fadeIn">
            <header className="flex-shrink-0 bg-gray-800/80 backdrop-blur-md p-3 text-center sticky top-0 z-10">
                <h1 className="font-bold text-base">{title}</h1>
            </header>
            
            <main className="flex-grow overflow-y-auto p-4">
                {children}
            </main>
            
            <footer className="flex-shrink-0 flex justify-center items-center py-2" onClick={goHome}>
                <div className="w-32 h-1.5 bg-gray-400 rounded-full cursor-pointer hover:bg-white transition-colors"></div>
            </footer>
        </div>
    );
};

export default AppView;