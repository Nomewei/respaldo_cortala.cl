import React from 'react';
import { Plan } from '../types';
import { RECOMMENDED_PLAN_NAME } from '../constants';
import PlanCard from './PlanCard';

interface PlansSectionProps {
    plans: Plan[];
    onPlanSelect: (plan: Plan) => void;
    hasReferral: boolean;
}

const PlansSection: React.FC<PlansSectionProps> = ({ plans, onPlanSelect, hasReferral }) => {
    return (
        <section id="plans-section" className="py-16 lg:py-24 fade-in">
            <h2 className="text-3xl font-bold text-center mb-2">Paso 1: Elige tu plan</h2>
            <p className="text-center text-gray-600 mb-12">Un "slot" te permite proteger un Teléfono o un Correo electrónico. ¡Tú eliges!</p>
            {hasReferral && (
                <div className="mb-8 text-center bg-green-100 text-green-800 p-4 rounded-lg max-w-2xl mx-auto border border-green-200">
                    <p className="font-semibold">¡Gracias a tu referido, tienes 1 slot extra en cualquier plan que elijas!</p>
                </div>
            )}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {plans.map(plan => (
                    <PlanCard
                        key={plan.name}
                        plan={plan}
                        isRecommended={plan.name === RECOMMENDED_PLAN_NAME}
                        onSelect={() => onPlanSelect(plan)}
                    />
                ))}
            </div>
        </section>
    );
};

export default PlansSection;
