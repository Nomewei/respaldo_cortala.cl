import React, { useState, useEffect } from 'react';
import { Plan } from '../types';
import { PlusIcon, TrashIcon } from './icons/Icons';

interface ContactsSectionProps {
    plan: Plan;
    contacts: string[];
    setContacts: React.Dispatch<React.SetStateAction<string[]>>;
    onContinue: () => void;
    onBack: () => void;
}

const ContactsSection: React.FC<ContactsSectionProps> = ({ plan, contacts, setContacts, onContinue, onBack }) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    const slotsFilled = contacts.length;
    const totalSlots = plan.slots;
    const canAddMore = slotsFilled < totalSlots;

    const handleAddContact = () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput) {
            setError('El campo no puede estar vacío.');
            return;
        }
        if (!canAddMore) {
            setError('Has alcanzado el límite de slots.');
            return;
        }
        if (contacts.includes(trimmedInput)) {
            setError('Este contacto ya ha sido añadido.');
            return;
        }
        
        setContacts([...contacts, trimmedInput]);
        setInputValue('');
        setError('');
    };

    const handleRemoveContact = (contactToRemove: string) => {
        setContacts(contacts.filter(c => c !== contactToRemove));
    };
    
    useEffect(() => {
        if(inputValue) setError('');
    }, [inputValue]);


    return (
        <section id="contacts-section" className="py-24 fade-in">
            <h2 className="text-3xl font-bold text-center mb-4">Paso 2: Ingresa los contactos a proteger</h2>
            <p className="text-center text-gray-600 mb-12">Tienes {totalSlots} slots para elegir entre teléfonos y correos.</p>
            
            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-lg text-gray-800">Añade aquí tus Contactos</h3>
                    <p className="font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm">{slotsFilled} / {totalSlots}</p>
                </div>
                
                <div className="relative mb-1">
                    <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                        <span className="px-3 text-gray-500 bg-gray-100 h-full flex items-center rounded-l-lg border-r border-gray-300">+56</span>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && canAddMore && inputValue && handleAddContact()}
                            placeholder="987654321 o correo@ejemplo.com"
                            className="w-full px-4 py-3 border-0 rounded-r-lg focus:outline-none"
                            disabled={!canAddMore}
                        />
                    </div>
                    <button 
                        onClick={handleAddContact}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white font-bold w-10 h-10 flex items-center justify-center rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={!canAddMore || !inputValue}
                        aria-label="Añadir contacto"
                    >
                        <PlusIcon />
                    </button>
                </div>
                <p className="text-red-500 text-sm h-5 mb-2 px-1">{error}</p>
                
                <div id="contact-list" className="space-y-2 mb-6 min-h-[50px]">
                    {contacts.map(contact => (
                         <div key={contact} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg animate-scale-in border border-slate-200">
                            <span className="text-gray-800 font-medium break-all">{contact}</span>
                            <button 
                                onClick={() => handleRemoveContact(contact)} 
                                className="delete-contact-btn text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                                aria-label={`Eliminar ${contact}`}
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    ))}
                </div>
                
                <button 
                    onClick={onContinue}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={contacts.length === 0}
                >
                    Continuar al Pago
                </button>
                
                <div className="text-center mt-4">
                    <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 transition">← Volver a Planes</button>
                </div>
            </div>
        </section>
    );
};

export default ContactsSection;
