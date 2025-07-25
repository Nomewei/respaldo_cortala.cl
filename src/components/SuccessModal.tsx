import React, { useState } from 'react';
import { CheckCircleIcon, CopyIcon } from './icons/Icons';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    referralCode: string | null;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, referralCode }) => {
    const [isCopied, setIsCopied] = useState(false);

    if (!isOpen) return null;
    
    const handleClose = () => {
        onClose();
        window.location.href = '/';
    }

    const handleCopy = () => {
        if (referralCode) {
            const referralLink = `${window.location.origin}/?ref=${referralCode}`;
            navigator.clipboard.writeText(referralLink);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full relative animate-scale-in text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon />
                </div>
                <h3 className="text-2xl font-bold mb-2">¡Listo! Tu solicitud está en proceso.</h3>
                <p className="text-gray-600 mb-6">Recibirás un email de confirmación con los detalles y próximos pasos en breve.</p>
                
                {referralCode && (
                    <div className="my-8 py-6 border-t border-b border-gray-200">
                        <h4 className="text-lg font-bold text-gray-800">¡Recomienda y obtén beneficios!</h4>
                        <p className="text-gray-600 mt-2 mb-4">Comparte tu enlace de referido. ¡Tus amigos recibirán un slot extra y tú también podrías ganar!</p>
                        <div className="flex items-center w-full bg-gray-100 border rounded-lg p-2">
                            <input 
                                type="text" 
                                readOnly 
                                value={`${window.location.origin}/?ref=${referralCode}`}
                                className="bg-transparent flex-grow text-gray-700 focus:outline-none"
                            />
                            <button 
                                onClick={handleCopy}
                                className={`ml-2 px-3 py-2 text-sm font-semibold rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${isCopied ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            >
                                <CopyIcon />
                                <span className="ml-2">{isCopied ? '¡Copiado!' : 'Copiar'}</span>
                            </button>
                        </div>
                    </div>
                )}

                <button onClick={handleClose} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition">
                    Entendido
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
