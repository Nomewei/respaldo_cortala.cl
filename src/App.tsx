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
import BreachReportForm from './components/BreachReportForm';

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

    const handleStart = () => {
        setStep(Step.Plans);
    };

    const handlePlanSelect = (plan: Plan) => {
        setSelectedPlan(plan);
        setContacts([]); // Reset contacts when changing plan
        setStep(Step.Contacts);
        setTimeout(() => {
            document.getElementById('contacts-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleNavigateToPayment = () => {
        setStep(Step.Payment);
         setTimeout(() => {
            document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };
    
    const handleGoHome = () => {
        setStep(Step.Hero);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleBack = () => {
        if (step > Step.Plans) {
            setStep(step - 1);
        } else {
            setStep(Step.Hero);
        }
    };

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

            if (preference.init_point) {
                window.location.href = preference.init_point;
            } else {
                throw new Error('No se recibió la URL de pago.');
            }
        } catch (error) {
            console.error("Error creating payment preference:", error);
            if (error instanceof Error) {
                 throw error;
            }
            throw new Error('An unknown error occurred.');
        }
    }, [selectedPlan, contacts, referralCode]);

    const renderStep = () => {
        switch (step) {
            case Step.Hero:
                return <HeroSection onStart={handleStart} />;
            case Step.Plans:
                return <PlansSection plans={plans} onPlanSelect={handlePlanSelect} hasReferral={!!referralCode} />;
            case Step.Contacts:
                return selectedPlan && (
                    <ContactsSection
                        plan={selectedPlan}
                        contacts={contacts}
                        setContacts={setContacts}
                        onContinue={handleNavigateToPayment}
                        onBack={() => setStep(Step.Plans)}
                    />
                );
            case Step.Payment:
                return selectedPlan && (
                    <PaymentSection
                        plan={selectedPlan}
                        contacts={contacts}
                        onSubmit={handlePaymentSubmit}
                        onBack={() => setStep(Step.Contacts)}
                    />
                );
            default:
                return <HeroSection onStart={handleStart} />;
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
                {step === Step.Hero ? renderStep() : (
                     <div className="container mx-auto px-6">
                        <ProgressBar step={step} />
                        {renderStep()}
                    </div>
                )}
            </main>
            
            <footer className="bg-gray-800 text-white mt-16">
                <div className="container mx-auto px-6 py-8 text-center text-gray-400">
                    <p>© {new Date().getFullYear()} Córtala.cl. Todos los derechos reservados.</p>
                    <p className="text-sm mt-2">Un servicio diseñado para proteger tu tranquilidad.</p>
                </div>
            </footer>

            <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setSuccessModalOpen(false)} />

            <Modal title="Preguntas Frecuentes (FAQ)" isOpen={isFaqModalOpen} onClose={() => setFaqModalOpen(false)}>
                <p>Aquí irá el contenido de las preguntas frecuentes...</p>
            </Modal>
            <Modal title="Términos y Condiciones" isOpen={isTermsModalOpen} onClose={() => setTermsModalOpen(false)}>
                 <p>Aquí irá el contenido detallado de los términos y condiciones del servicio...</p>
            </Modal>
             <Modal title="Avisar Incumplimiento" isOpen={isBreachModalOpen} onClose={() => setBreachModalOpen(false)}>
                 <BreachReportForm onClose={() => setBreachModalOpen(false)} />
            </Modal>
             <Modal title="Ayuda y Contacto" isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)}>
                 <p>Aquí irá la información de contacto y ayuda...</p>
            </Modal>
        </div>
    );
};

export default App;
