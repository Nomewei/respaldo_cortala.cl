import React from 'react';
import { Step } from '../types';

interface ProgressBarProps {
    step: Step;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ step }) => {
    const getProgressPercentage = () => {
        switch (step) {
            case Step.Plans: return 33;
            case Step.Contacts: return 66;
            case Step.Payment: return 100;
            default: return 0;
        }
    };
    
    const percentage = getProgressPercentage();

    return (
        <div className="sticky top-20 z-30 bg-slate-50/80 backdrop-filter backdrop-blur-sm py-4 transition-opacity duration-300 ease-in-out">
            <div className="bg-gray-200 rounded-full h-2.5 w-full">
                <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
