import React from 'react';
import { Plan } from '../types';

interface PlanCardProps {
    plan: Plan;
    isRecommended: boolean;
    onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isRecommended, onSelect }) => {
    
    const getSavingsBadge = () => {
        if (plan.name === "Dúo") return <div className="savings-badge">Ahorras 17%</div>;
        if (plan.name === "Familiar") return <div className="savings-badge">Ahorras 35%</div>;
        return null;
    }

    return (
        <div 
            onClick={onSelect} 
            className={`relative flex flex-col h-full cursor-pointer bg-white p-8 rounded-xl border-2 text-center transition-all duration-200 ease-in-out hover:transform hover:-translate-y-1.5 focus:outline-none focus:ring-4 focus:ring-blue-300 ${isRecommended ? 'border-blue-600 shadow-xl' : 'border-gray-200 hover:border-blue-400'}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
        >
            {isRecommended && <div className="absolute top-0 right-5 -mt-4 transform rotate-12 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Recomendado</div>}
            
            <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-5xl font-extrabold mb-4">
                    {plan.originalSlots ? (
                        <>
                           {plan.originalSlots} <span className="text-green-500 font-bold">+1</span>
                        </>
                    ) : (
                        plan.slots
                    )}
                    <span className="text-lg font-medium"> slots</span>
                </p>
                <p className="text-gray-500 mb-4 h-10">
                    Eliges entre {plan.slots} teléfonos y correos.
                </p>
                {getSavingsBadge()}
            </div>
            <div className="mt-auto">
                <p className="text-2xl font-bold text-blue-600 mt-4 mb-2">${plan.price.toLocaleString('es-CL')}</p>
                <button tabIndex={-1} className="w-full mt-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">Elegir Plan</button>
            </div>
        </div>
    );
};

export default PlanCard;
