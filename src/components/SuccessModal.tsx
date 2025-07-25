import React from 'react';
import { CheckCircleIcon } from './icons/Icons';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    
    const handleClose = () => {
        onClose();
        // Optionally, redirect to home page clean
        window.location.href = '/';
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full relative animate-scale-in text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon />
                </div>
                <h3 className="text-2xl font-bold mb-2">¡Listo! Tu solicitud está en proceso.</h3>
                <p className="text-gray-600 mb-6">Recibirás un email de confirmación con los detalles y próximos pasos en breve.</p>
                <button onClick={handleClose} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition">
                    Entendido
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
