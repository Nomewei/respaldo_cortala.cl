import React, { useState } from 'react';
import { submitBreachReport, BreachReportPayload } from '../services/apiService';
import { CheckCircleIcon, SendIcon } from './icons/Icons';

interface BreachReportFormProps {
    onClose: () => void;
}

const BreachReportForm: React.FC<BreachReportFormProps> = ({ onClose }) => {
    const [formData, setFormData] = useState<BreachReportPayload>({
        name: '',
        email: '',
        spamSource: '',
        details: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.spamSource || !formData.details) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await submitBreachReport(formData);
            setIsSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isSuccess) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon />
                </div>
                <h4 className="text-xl font-bold mb-2">Reporte Enviado</h4>
                <p className="text-gray-600 mb-6">Gracias por tu reporte. Lo revisaremos a la brevedad.</p>
                <button onClick={onClose} className="bg-blue-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-700 transition">
                    Cerrar
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <p className="text-sm text-gray-600 mb-4">Si una empresa te sigue contactando a pesar de nuestros servicios, por favor infórmanos aquí. Investigaremos y tomaremos las acciones necesarias.</p>
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tu Nombre</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Tu Email de Contacto</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label htmlFor="spamSource" className="block text-sm font-medium text-gray-700">Teléfono o Correo que recibió SPAM</label>
                <input type="text" name="spamSource" id="spamSource" value={formData.spamSource} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700">Detalles del Incumplimiento</label>
                <textarea name="details" id="details" rows={4} value={formData.details} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required placeholder="Ej: Recibí un SMS de la empresa 'X' el día de ayer a las 15:30..."></textarea>
            </div>
            <div className="pt-2 text-right">
                <button type="submit" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400" disabled={isLoading}>
                    {isLoading ? (
                        <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                        </>
                    ) : (
                       <>
                        <SendIcon />
                        Enviar Reporte
                       </>
                    )}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
    );
};

export default BreachReportForm;
