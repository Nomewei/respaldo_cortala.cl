import React, { useState } from 'react';
import { LogoIcon, MenuIcon, CloseIcon } from './icons/Icons';

interface HeaderProps {
    onGoHome: () => void;
    onShowPlans: () => void;
    onShowFaq: () => void;
    onShowTerms: () => void;
    onShowBreach: () => void;
    onShowContact: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome, onShowPlans, onShowFaq, onShowTerms, onShowBreach, onShowContact }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const handleMobileLinkClick = (action: () => void) => {
        action();
        setMobileMenuOpen(false);
    }
    
    const navLinks = [
        { label: "Planes", action: onShowPlans },
        { label: "FAQ's", action: onShowFaq },
        { label: "Términos", action: onShowTerms },
        { label: "Avisar Incumplimiento", action: onShowBreach },
        { label: "Ayuda", action: onShowContact },
    ];

    return (
        <>
            <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-gray-200 h-20 flex items-center">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <button onClick={onGoHome} className="flex items-center gap-2 text-2xl font-bold text-blue-700">
                        <LogoIcon />
                        <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-[#1d4ed8]">órtala</span>
                            <span className="text-2xl font-bold text-[#3b82f6]">.cl</span>
                        </div>
                    </button>
                    <nav className="hidden md:flex items-center space-x-6 text-gray-600">
                        {navLinks.map(link => (
                             <button key={link.label} onClick={link.action} className="hover:text-blue-600 transition">{link.label}</button>
                        ))}
                    </nav>
                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(true)} className="text-gray-700 focus:outline-none"><MenuIcon /></button>
                    </div>
                </div>
            </header>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)} />
            <div className={`fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-white z-50 shadow-xl transition-transform transform md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                 <div className="p-6 pt-20 flex flex-col h-full">
                     <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-gray-800"><CloseIcon /></button>
                    <nav className="flex flex-col space-y-4">
                         {navLinks.map(link => (
                             <button key={link.label} onClick={() => handleMobileLinkClick(link.action)} className="text-left py-3 text-lg text-gray-700 hover:text-blue-600 transition">{link.label}</button>
                        ))}
                    </nav>
                 </div>
            </div>
        </>
    );
};
export default Header;
