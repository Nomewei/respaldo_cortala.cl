import React from 'react';
import { CloseIcon } from './icons/Icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full relative animate-scale-in" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"><CloseIcon /></button>
                <h3 className="text-2xl font-bold mb-4">{title}</h3>
                <div>{children}</div>
                 <div className="mt-6 text-right">
                     <button onClick={onClose} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Cerrar</button>
                </div>
            </div>
        </div>
    );
};
export default Modal;
