import React, { useState } from 'react';
import { Plan } from '../types';
import { LockIcon, SecurePaymentIcon } from './icons/Icons';

interface PaymentSectionProps {
    plan: Plan;
    contacts: string[];
    onSubmit: (payer: { firstName: string; lastName: string }) => Promise<void>;
    onBack: () => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ plan, contacts, onSubmit, onBack }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const isFormValid = firstName.trim() !== '' && lastName.trim() !== '' && termsAccepted;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsLoading(true);
        setError('');
        try {
            await onSubmit({ firstName, lastName });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
            setIsLoading(false);
        }
    };

    return (
        <section id="payment-section" className="py-24 fade-in">
            <h2 className="text-3xl font-bold text-center mb-12">Paso 3: Un último paso para tu tranquilidad</h2>
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold mb-4">Resumen de tu compra</h3>
                    <div className="space-y-3 text-gray-600">
                        <div className="flex justify-between"><span>Plan:</span><span className="font-semibold text-gray-800">{plan.name}</span></div>
                        <div className="flex justify-between"><span>Contactos a proteger:</span><span className="font-semibold text-gray-800">{contacts.length}</span></div>
                        <hr className="my-4" />
                        <div className="flex justify-between text-lg font-bold text-gray-900"><span>TOTAL:</span><span>${plan.price.toLocaleString('es-CL')}</span></div>
                    </div>
                    <div className="mt-6 bg-slate-50 p-4 rounded-lg text-center border border-slate-200">
                        <h4 className="font-semibold text-gray-700">Garantía de Gestión</h4>
                        <p className="text-sm text-gray-600 mt-1">Nos aseguramos de que tus datos queden correctamente inscritos en la plataforma oficial del SERNAC.</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col">
                    <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold mb-2">Datos del Comprador</h3>
                             <p className="text-gray-600 mb-6 text-sm">Esta información es para mejorar la seguridad de tu pago y no será compartida.</p>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="payer-firstname" className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input type="text" id="payer-firstname" required value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="payer-lastname" className="block text-sm font-medium text-gray-700">Apellido</label>
                                    <input type="text" id="payer-lastname" required value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div className="pt-2">
                                    <label htmlFor="terms-checkbox" className="flex items-start cursor-pointer">
                                        <input type="checkbox" id="terms-checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="h-5 w-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0" />
                                        <span className="ml-3 text-sm text-gray-600">
                                            Acepto los <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline font-semibold">Términos y Condiciones</a> y autorizo el uso de mis datos para la gestión en SERNAC.
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                           <button type="submit" className="w-full mt-8 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3" disabled={!isFormValid || isLoading}>
                                {isLoading ? (
                                    <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                    </>
                                ) : (
                                    <>
                                        <span>Pagar y Proteger</span>
                                        <LockIcon />
                                    </>
                                )}
                            </button>
                             <p className="text-red-500 text-sm text-center mt-3 h-5">{error}</p>
                             <div className="text-center text-xs text-gray-500 mt-2 flex items-center justify-center gap-2">
                                <SecurePaymentIcon /> Pago seguro procesado por Mercado Pago
                            </div>
                        </div>
                    </form>
                    <div className="text-center mt-4">
                        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 transition">← Volver a Contactos</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PaymentSection;
