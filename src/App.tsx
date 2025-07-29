import React, { useState, useEffect, useCallback } from 'react';

// ==================================================================
//  CÓDIGO BASADO EN TU VERSIÓN ORIGINAL Y FUNCIONAL
//  Se han integrado únicamente las mejoras visuales en los modales.
// ==================================================================

// --- TIPOS Y CONSTANTES (De tu código original) ---
enum Step {
    Hero,
    Plans,
    Contacts,
    Payment,
}

interface Plan {
  name: string;
  slots: number;
  price: number;
  description: string;
  features: string[];
  originalSlots?: number;
}

const PLANS: Plan[] = [
    { name: 'Personal', slots: 1, price: 4990, description: "Ideal para proteger tu número / correo personal.", features: ["Protección para 1 contacto", "Inscripción automatizada"] },
    { name: 'Dúo', slots: 2, price: 8990, description: "Protege tu número y el de un familiar.", features: ["Protección para 2 contactos", "Perfecto para parejas y amigos"] },
    { name: 'Familiar', slots: 6, price: 19990, description: "La mejor opción para toda la familia.", features: ["Protección para 6 contactos", "El mayor ahorro por contacto"] }
];

// --- SERVICIO DE API (De tu código original) ---
const createCheckoutPreference = async (payload: { title: string; price: number; payer_firstname: string; payer_lastname: string; contacts_to_protect: string[], referral_code: string | null }) => {
    const response = await fetch('/create_preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error del servidor');
    }
    return response.json();
};

// --- ICONOS ---
const CloseIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const ChevronDownIcon = () => <svg className="h-5 w-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const LogoIcon = () => <svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg" fill="#3b82f6"><path d="M16,3A13,13,0,1,0,29,16,13,13,0,0,0,16,3Zm0,24A11,11,0,1,1,27,16,11,11,0,0,1,16,27Z" /><path d="M19.71,11.29a1,1,0,0,0-1.42,0L16,13.59,13.71,11.29a1,1,0,0,0-1.42,1.42L14.59,16,12.29,18.29a1,1,0,1,0,1.42,1.42L16,17.41l2.29,2.3a1,1,0,0,0,1.42-1.42L17.41,16l2.3-2.29A1,1,0,0,0,19.71,11.29Z" /></svg>;
const MenuIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>;
const PlusIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const TrashIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const LockIcon = () => <svg className="w-5 h-5 inline-block ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>;

// --- COMPONENTES DE UI ---

const Modal: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onClose: () => void; }> = ({ title, children, isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="fixed inset-0" onClick={onClose} aria-hidden="true"></div>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col relative">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><CloseIcon /></button>
                </div>
                <div className="p-6 overflow-y-auto">{children}</div>
                <div className="p-4 border-t text-right bg-gray-50 rounded-b-lg">
                    <button onClick={onClose} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

const SuccessModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    return (
        <Modal title="¡Pago Exitoso!" isOpen={isOpen} onClose={onClose}>
            <div className="text-center">
                <p className="text-lg">¡Gracias por tu compra! Hemos recibido tu pago y comenzaremos la gestión de tus contactos a la brevedad.</p>
            </div>
        </Modal>
    );
};

const Header: React.FC<{ onGoHome: () => void; onShowPlans: () => void; onShowFaq: () => void; onShowTerms: () => void; onShowBreach: () => void; onShowContact: () => void; }> = ({ onGoHome, onShowPlans, onShowFaq, onShowTerms, onShowBreach, onShowContact }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const handleMobileLinkClick = (action: () => void) => { action(); setMobileMenuOpen(false); }
    const navLinks = [
        { label: "Planes", action: onShowPlans },
        { label: "FAQ's", action: onShowFaq },
        { label: "Términos", action: onShowTerms },
        { label: "Avisar Incumplimiento", action: onShowBreach },
        { label: "Contacto", action: onShowContact },
    ];
    return (
        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-gray-200 h-20 flex items-center">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <button onClick={onGoHome} className="flex items-center gap-2 text-2xl font-bold text-blue-700">
                    <LogoIcon />
                    <div className="flex items-baseline"><span className="text-2xl font-bold text-[#1d4ed8]">órtala</span><span className="text-2xl font-bold text-[#3b82f6]">.cl</span></div>
                </button>
                <nav className="hidden md:flex items-center space-x-6 text-gray-600">
                    {navLinks.map(link => (<button key={link.label} onClick={link.action} className="hover:text-blue-600 transition">{link.label}</button>))}
                </nav>
                <div className="md:hidden"><button onClick={() => setMobileMenuOpen(true)} className="text-gray-700 focus:outline-none"><MenuIcon /></button></div>
            </div>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)} />
            <div className={`fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-white z-50 shadow-xl transition-transform transform md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                 <div className="p-6 pt-20 flex flex-col h-full">
                    <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-gray-800"><CloseIcon /></button>
                    <nav className="flex flex-col space-y-4">
                        {navLinks.map(link => (<button key={link.label} onClick={() => handleMobileLinkClick(link.action)} className="text-left py-3 text-lg text-gray-700 hover:text-blue-600 transition">{link.label}</button>))}
                    </nav>
                 </div>
            </div>
        </header>
    );
};

const ProgressBar: React.FC<{ step: Step }> = ({ step }) => {
    const steps = [
        { id: Step.Plans, title: 'Elige tu Plan' },
        { id: Step.Contacts, title: 'Ingresa Datos' },
        { id: Step.Payment, title: 'Paga y Protege' },
    ];
    const currentStepIndex = steps.findIndex(s => s.id === step);
    if (currentStepIndex < 0) return null;

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <ol className="flex items-center">
                {steps.map((s, index) => (
                    <React.Fragment key={s.id}>
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 ${index <= currentStepIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {index + 1}
                            </div>
                            <p className={`mt-2 text-xs sm:text-sm font-medium ${index <= currentStepIndex ? 'text-gray-800' : 'text-gray-500'}`}>{s.title}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-auto border-t-4 ${index < currentStepIndex ? 'border-blue-600' : 'border-gray-200'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </ol>
        </div>
    );
};

const HeroSection: React.FC<{ onStart: () => void }> = ({ onStart }) => {
    const [clientCount, setClientCount] = useState(1470);
    useEffect(() => {
        const interval = setInterval(() => setClientCount(prev => prev + 1), 3000 * (Math.random() + 1));
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="hero-gradient text-white">
            <div className="container mx-auto px-6 text-center py-20 md:py-28">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">Libérate del SPAM en sólo 3 pasos</h1>
                <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto mb-8">Gestionamos el ingreso de tus teléfonos y correos en la lista "No Molestar" del SERNAC.</p>
                <button onClick={onStart} className="bg-white text-blue-700 font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-100 transition transform hover:scale-105">Comenzar Ahora</button>
                <div className="mt-12">
                    <p className="text-sm uppercase tracking-widest text-blue-300">Protecciones en tiempo real</p>
                    <p className="text-4xl font-bold">{clientCount.toLocaleString('es-CL')}</p>
                </div>
            </div>
        </section>
    );
};

const PlansSection: React.FC<{ plans: Plan[]; onPlanSelect: (plan: Plan) => void; hasReferral: boolean; }> = ({ plans, onPlanSelect, hasReferral }) => (
    <section id="plans-section" className="py-16 lg:py-24">
        {hasReferral && (
            <div className="mb-8 text-center bg-green-100 text-green-800 p-4 rounded-lg max-w-2xl mx-auto border border-green-200">
                <p className="font-semibold">¡Gracias a tu referido, tienes 1 contacto extra en cualquier plan que elijas!</p>
            </div>
        )}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
            {plans.map(plan => (<PlanCard key={plan.name} plan={plan} isRecommended={plan.name === RECOMMENDED_PLAN_NAME} onSelect={() => onPlanSelect(plan)}/>))}
        </div>
    </section>
);

const PlanCard: React.FC<{ plan: Plan; isRecommended: boolean; onSelect: () => void; }> = ({ plan, isRecommended, onSelect }) => {
    const originalPrice = (plan.originalSlots || plan.slots) * BASE_PRICE_PER_CONTACT;
    const hasDiscount = plan.price < originalPrice;
    const discountPercentage = hasDiscount ? Math.round(((originalPrice - plan.price) / originalPrice) * 100) : 0;

    return (
        <button onClick={onSelect} className={`text-left bg-white border rounded-lg p-8 flex flex-col relative overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl ${isRecommended ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'}`}>
            {hasDiscount && (
                <div className="absolute top-0 right-0 w-32 h-32">
                    <div className="absolute transform rotate-45 bg-blue-600 text-center text-white font-semibold py-1 right-[-34px] top-[32px] w-[170px]">
                        Ahorra {discountPercentage}%
                    </div>
                </div>
            )}
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {plan.name === 'Personal' && <UserIcon />}
                {plan.name === 'Dúo' && <UsersIcon />}
                {plan.name === 'Familiar' && <FamilyIcon />}
                {plan.name}
            </h3>
            <p className="mt-2 text-gray-500">{plan.description}</p>
            <div className="mt-6 text-center">
                {hasDiscount && (
                    <p className="text-gray-500 line-through">${originalPrice.toLocaleString('es-CL')}</p>
                )}
                <p className="text-5xl font-extrabold text-gray-900">
                    <span className="align-top text-2xl font-semibold mr-1">$</span>
                    {plan.price.toLocaleString('es-CL')}
                </p>
                <p className="text-lg font-medium text-gray-500">/pago único</p>
            </div>
            <ul className="mt-8 space-y-4 text-gray-600 flex-grow">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <svg className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-base">{feature}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-8 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-center">
              Elegir Plan
            </div>
        </button>
    );
};

const ContactsSection: React.FC<{ plan: Plan; contacts: string[]; setContacts: React.Dispatch<React.SetStateAction<string[]>>; onBack: () => void; onContinue: () => void; }> = ({ plan, contacts, setContacts, onContinue, onBack }) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');
    const slotsFilled = contacts.length;
    const totalSlots = plan.slots;
    const canAddMore = slotsFilled < totalSlots;

    const validateAndAdd = () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput) { setError('El campo no puede estar vacío.'); return; }

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedInput);
        const isPhone = /^9[0-9]{8}$/.test(trimmedInput);

        if (!isEmail && !isPhone) {
            setError('Formato inválido. Ingresa un celular (9xxxxxxxx) o un email.');
            return;
        }
        
        if (!canAddMore) { setError(`Has alcanzado el límite de ${totalSlots} contactos.`); return; }
        if (contacts.includes(trimmedInput)) { setError('Este contacto ya ha sido añadido.'); return; }
        
        setContacts([...contacts, trimmedInput]);
        setInputValue('');
        setError('');
    };

    const handleRemoveContact = (contactToRemove: string) => { setContacts(contacts.filter(c => c !== contactToRemove)); };
    useEffect(() => { if(inputValue) setError(''); }, [inputValue]);

    return (
        <section id="contacts-section" className="py-12 bg-gray-50">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-lg text-gray-800">Añade aquí tus Contactos</h3>
                    <p className="font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm">{slotsFilled} / {totalSlots}</p>
                </div>
                <div className="relative mb-1">
                    <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && canAddMore && inputValue && validateAndAdd()} placeholder="987654321 o correo@ejemplo.com" className="w-full px-4 py-3 border-0 rounded-lg focus:outline-none" disabled={!canAddMore}/>
                    </div>
                    <button onClick={validateAndAdd} className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white font-bold w-10 h-10 flex items-center justify-center rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed" disabled={!canAddMore || !inputValue} aria-label="Añadir contacto"><PlusIcon /></button>
                </div>
                <p className="text-red-500 text-sm h-5 mb-2 px-1">{error}</p>
                <div id="contact-list" className="space-y-2 mb-6 min-h-[50px]">
                    {contacts.map(contact => (<div key={contact} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200"><span className="text-gray-800 font-medium break-all">{contact}</span><button onClick={() => handleRemoveContact(contact)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors" aria-label={`Eliminar ${contact}`}><TrashIcon /></button></div>))}
                </div>
                <button onClick={onContinue} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={contacts.length === 0}>Continuar al Pago</button>
                <div className="text-center mt-4"><button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 transition">← Volver a Planes</button></div>
            </div>
        </section>
    );
};

const PaymentSection: React.FC<{ plan: Plan; contacts: string[]; onSubmit: (payer: { firstName: string; lastName: string }) => Promise<void>; onBack: () => void; }> = ({ plan, contacts, onSubmit, onBack }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!firstName || !lastName) {
            setError('Por favor, completa tu nombre y apellido.');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await onSubmit({ firstName, lastName });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
            setIsLoading(false);
        }
    };

    return (
        <section id="payment-section" className="py-12 bg-gray-50">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col">
                        <h3 className="text-xl font-bold mb-4">Resumen de tu compra</h3>
                        <div className="flex justify-between py-2 border-b"><span>Plan:</span><span className="font-semibold">{plan.name}</span></div>
                        <div className="flex justify-between py-2 border-b"><span>Contactos a proteger:</span><span className="font-semibold">{contacts.length}</span></div>
                        <div className="flex justify-between py-4 text-xl font-bold"><span>TOTAL:</span><span>${plan.price.toLocaleString('es-CL')}</span></div>
                        <div className="mt-auto bg-gray-100 p-4 rounded-lg text-center">
                            <h4 className="font-bold">Garantía de Gestión</h4>
                            <p className="text-sm text-gray-600 mt-2">Nos aseguramos de que tus datos queden correctamente inscritos en la plataforma oficial del SERNAC.</p>
                            <button onClick={onBack} className="text-sm text-blue-600 hover:text-blue-800 transition mt-2">← Volver a Contactos</button>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                        <h3 className="text-xl font-bold mb-2">Datos del Comprador</h3>
                        <p className="text-sm text-gray-500 mb-6">Esta información es para mejorar la seguridad de tu pago y no será compartida.</p>
                        <div className="space-y-4">
                            <div><label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">Nombre</label><input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" /></div>
                            <div><label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">Apellido</label><input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" /></div>
                            <div className="flex items-center">
                                <input id="terms" name="terms" type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                                <label htmlFor="terms" className="ml-3 block text-sm leading-6 text-gray-900">Acepto los <button className="font-semibold text-blue-600 hover:underline">Términos y Condiciones</button></label>
                            </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <button onClick={handleSubmit} disabled={isLoading || !termsAccepted} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
                                {isLoading ? 'Procesando...' : 'Pagar y Proteger'} <LockIcon />
                            </button>
                            <p className="text-center text-xs text-gray-500">Pago seguro procesado por Mercado Pago</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onClick: () => void; }> = ({ title, children, isOpen, onClick }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button onClick={onClick} className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition">
            <span className="text-base font-semibold text-gray-900">{title}</span>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><ChevronDownIcon /></span>
        </button>
        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
            <div className="px-4 pb-4 text-gray-700 border-t border-gray-200 pt-4"><div className="prose max-w-none">{children}</div></div>
        </div>
    </div>
);

const FaqContent: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const faqs = [
        { q: "¿Qué es exactamente el 'No Molestar' del SERNAC?", a: "Es una herramienta oficial del Servicio Nacional del Consumidor (SERNAC) en Chile que permite a las personas solicitar que sus números de teléfono y correos electrónicos sean eliminados de las listas de marketing y promociones de las empresas." },
        { q: "¿Mi plan protege contra el 100% de las empresas?", a: "Nuestro servicio gestiona tu inscripción en la plataforma oficial, lo que obliga a la gran mayoría de las empresas a dejar de contactarte. Si recibes contacto de una empresa no cubierta, puedes usar nuestra herramienta 'Avisar Incumplimiento' para que tomemos acciones adicionales." },
        { q: "¿Este es un pago único o una suscripción?", a: "Es un pago 100% único por la gestión. No hay cargos recurrentes ni suscripciones ocultas. Pagas una vez y nosotros nos encargamos del resto." },
        { q: "¿Cuánto tiempo tarda en hacer efecto el registro?", a: "Una vez que realizas el pago, iniciamos la gestión en un plazo de 24 a 48 horas hábiles. La ley otorga a las empresas un plazo para actualizar sus sistemas, por lo que la reducción del SPAM es gradual y puede tomar algunos días en ser totalmente efectiva." },
    ];
    return (<div className="space-y-4">{faqs.map((faq, index) => (<AccordionItem key={index} title={faq.q} isOpen={openIndex === index} onClick={() => setOpenIndex(openIndex === index ? null : index)}><p>{faq.a}</p></AccordionItem>))}</div>);
};

const TermsContent: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const sections = [
        { title: "1. Descripción del Servicio", content: "Córtala.cl ofrece un servicio de gestión de pago único para inscribir los datos de contacto (números de teléfono y/o correos electrónicos) proporcionados por el cliente en el registro 'No Molestar' del Servicio Nacional del Consumidor (SERNAC) de Chile." },
        { title: "2. Aceptación de los Términos", content: "Al acceder y utilizar nuestro servicio, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de los términos, no puede utilizar nuestro servicio." },
        { title: "3. Autorización y Uso de Datos", content: "Usted nos autoriza a utilizar los datos personales que nos proporciona con el único y exclusivo fin de realizar la gestión de inscripción ante el SERNAC. No compartiremos su información con terceros para fines distintos a los del servicio contratado." },
        { title: "4. Limitación de Responsabilidad", content: "Nuestro servicio se limita a la correcta gestión de la inscripción. No podemos garantizar la eliminación total e inmediata del SPAM, ya que las empresas tienen plazos legales para actualizar sus bases de datos. No nos hacemos responsables por las comunicaciones que pueda recibir de empresas que no cumplan con la normativa del SERNAC." },
    ];
    return (<div className="space-y-4">{sections.map((section, index) => (<AccordionItem key={index} title={section.title} isOpen={openIndex === index} onClick={() => setOpenIndex(openIndex === index ? null : index)}><p>{section.content}</p></AccordionItem>))}</div>);
};

// ==================================================================
//  COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ==================================================================

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
        setTimeout(() => {
            document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handlePlanSelect = (plan: Plan) => {
        setSelectedPlan(plan);
        setContacts([]);
        setStep(Step.Contacts);
         setTimeout(() => {
            document.getElementById('contacts-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };
    const handleNavigateToPayment = () => setStep(Step.Payment);
    const handleGoHome = () => {
        setStep(Step.Hero);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const handleBack = () => {
        const newStep = step > Step.Plans ? step - 1 : Step.Hero;
        setStep(newStep);
        const targetId = newStep === Step.Plans ? 'plans-section' : 'main-content';
        setTimeout(() => {
             document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handlePaymentSubmit = useCallback(async (payer: { firstName: string; lastName: string }) => {
        if (!selectedPlan) return;
        try {
            const preference = await createCheckoutPreference({
                title: `${selectedPlan.name} (${contacts.length} contactos)`,
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
                onShowPlans={handleStart}
                onShowFaq={() => setFaqModalOpen(true)}
                onShowTerms={() => setTermsModalOpen(true)}
                onShowBreach={() => setBreachModalOpen(true)}
                onShowContact={() => setContactModalOpen(true)}
            />
            <main id="main-content" className="flex-grow">
                {step === Step.Hero ? renderStepContent() : (
                    <div className="container mx-auto px-6">
                        <div className="py-8">
                            <ProgressBar step={step} />
                        </div>
                        {renderStepContent()}
                    </div>
                )}
            </main>
            <footer className="bg-gray-800 text-white mt-16">
                <div className="container mx-auto px-6 py-8 text-center text-gray-400">
                    <p>© {new Date().getFullYear()} Cortala.cl. Todos los derechos reservados.</p>
                </div>
            </footer>
            <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setSuccessModalOpen(false)} />
            
            <Modal title="Preguntas Frecuentes (FAQ)" isOpen={isFaqModalOpen} onClose={() => setFaqModalOpen(false)}>
                <FaqContent />
            </Modal>
            <Modal title="Términos y Condiciones" isOpen={isTermsModalOpen} onClose={() => setTermsModalOpen(false)}>
                <TermsContent />
            </Modal>
            <Modal title="Avisar Incumplimiento" isOpen={isBreachModalOpen} onClose={() => setBreachModalOpen(false)}>
                <p>Aquí irá el formulario de aviso de incumplimiento...</p>
            </Modal>
            <Modal title="Ayuda y Contacto" isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)}>
                <p>Aquí irá el contenido de ayuda y contacto...</p>
            </Modal>
        </div>
    );
};
export default App;
