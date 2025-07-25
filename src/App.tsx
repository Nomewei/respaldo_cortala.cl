import React, { useState, useEffect, useCallback } from 'react';
import { Plan, Step } from './types';
import { PLANS } from './constants';
import { createCheckoutPreference } from './services/apiService';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import HeroSection from './components/HeroSection';
import PlansSection from './components/PlansSection';
import ContactsSection from './components/ContactsSection';
import PaymentSection from './components/PaymentSection';
import Modal from './components/Modal';
import SuccessModal from './components/SuccessModal';

const App: React.FC = () => {
    const [step, setStep] = useState<Step>(Step.Hero);
    const [plans, setPlans] = useState<Plan[]>(PLANS);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [contacts, setContacts] = useState<string[]>([]);
    const [referralCode, setReferralCode] = useState<string | null>(null);
    
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    const [isFaqModalOpen, setFaqModalOpen] = useState(false);
    const [isTermsModalOpen, setTermsModalOpen] = useState(false);
    const [isBreachModalOpen, setBreachModalOpen] = useState(false);
    const [isContactModalOpen, setContactModalOpen] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const refParam = urlParams.get('ref');
        const paymentStatus = urlParams.get('status');

        if (refParam) {
            setReferralCode(refParam);
            const referredPlans = PLANS.map(p => ({ 
              ...p, 
              originalSlots: p.slots,
              slots: p.slots + 1 
            }));
            setPlans(referredPlans);
        }

        if (paymentStatus === 'success') {
            setSuccessModalOpen(true);
            window.history.replaceState({}, document.title, "/");
        }
    }, []);

    const handleStart = () => setStep(Step.Plans);
    const handlePlanSelect = (plan: Plan) => {
        setSelectedPlan(plan);
        setContacts([]);
        setStep(Step.Contacts);
    };
    const handleNavigateToPayment = () => setStep(Step.Payment);
    const handleGoHome = () => {
        setStep(Step.Hero);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const handleBack = () => step > Step.Plans ? setStep(step - 1) : setStep(Step.Hero);

    const handlePaymentSubmit = useCallback(async (payer: { firstName: string; lastName: string }) => {
        if (!selectedPlan) return;
        try {
            const preference = await createCheckoutPreference({
                title: `${selectedPlan.name} (${contacts.length} slots)`,
                price: selectedPlan.price,
                payer_firstname: payer.firstName,
                payer_lastname: payer.lastName,
                contacts_to_protect: contacts,
                referral_code: referralCode,
            });
            if (preference.init_point) window.location.href = preference.init_point;
        } catch (error) {
            console.error("Error creating payment preference:", error);
            if (error instanceof Error) throw error;
            throw new Error('An unknown error occurred.');
        }
    }, [selectedPlan, contacts, referralCode]);

    const renderStepContent = () => {
        switch (step) {
            case Step.Hero: return <HeroSection onStart={handleStart} />;
            case Step.Plans: return <PlansSection plans={plans} onPlanSelect={handlePlanSelect} hasReferral={!!referralCode} />;
            case Step.Contacts: return selectedPlan && <ContactsSection plan={selectedPlan} contacts={contacts} setContacts={setContacts} onContinue={handleNavigateToPayment} onBack={handleBack} />;
            case Step.Payment: return selectedPlan && <PaymentSection plan={selectedPlan} contacts={contacts} onSubmit={handlePaymentSubmit} onBack={handleBack} />;
            default: return <HeroSection onStart={handleStart} />;
        }
    };
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header 
                onGoHome={handleGoHome}
                onShowPlans={() => setStep(Step.Plans)}
                onShowFaq={() => setFaqModalOpen(true)}
                onShowTerms={() => setTermsModalOpen(true)}
                onShowBreach={() => setBreachModalOpen(true)}
                onShowContact={() => setContactModalOpen(true)}
            />
            <main id="main-content" className="flex-grow">
                {step === Step.Hero ? renderStepContent() : (
                     <div className="container mx-auto px-6">
                        <ProgressBar step={step} />
                        {renderStepContent()}
                    </div>
                )}
            </main>
            <footer className="bg-gray-800 text-white mt-16">
                <div className="container mx-auto px-6 py-8 text-center text-gray-400">
                    <p>© {new Date().getFullYear()} Córtala.cl. Todos los derechos reservados.</p>
                </div>
            </footer>
            <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setSuccessModalOpen(false)} />
            <Modal title="Preguntas Frecuentes (FAQ)" isOpen={isFaqModalOpen} onClose={() => setFaqModalOpen(false)}><p>Aquí irá el contenido...</p></Modal>
            <Modal title="Términos y Condiciones" isOpen={isTermsModalOpen} onClose={() => setTermsModalOpen(false)}><p>Aquí irá el contenido...</p></Modal>
            <Modal title="Avisar Incumplimiento" isOpen={isBreachModalOpen} onClose={() => setBreachModalOpen(false)}><p>Aquí irá el contenido...</p></Modal>
            <Modal title="Ayuda y Contacto" isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)}><p>Aquí irá el contenido...</p></Modal>
        </div>
    );
};
export default App;
