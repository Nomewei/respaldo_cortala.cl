import React, { useState, useEffect } from 'react';

interface HeroSectionProps {
    onStart: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStart }) => {
    const [clientCount, setClientCount] = useState(1470);
    useEffect(() => {
        const interval = setInterval(() => setClientCount(prev => prev + 1), 3000 * (Math.random() + 1));
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="hero-gradient text-white">
            <div className="container mx-auto px-6 text-center py-20 md:py-28">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">Libérate del SPAM en sólo 3 pasos</h1>
                <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto mb-8">Te ayudamos a dejar de recibir llamados y correos molestos. Inscribimos tus datos en la lista “No Molestar” del SERNAC y bloqueamos la publicidad de las principales empresas de retail, telecomunicaciones y banca.</p>
                <button onClick={onStart} className="bg-white text-blue-700 font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-100 transition transform hover:scale-105">Comenzar Ahora</button>
                <div className="mt-12">
                    <p className="text-sm uppercase tracking-widest text-blue-300">Protecciones en vivo</p>
                    <p className="text-4xl font-bold">{clientCount.toLocaleString('es-CL')}</p>
                </div>
            </div>
        </section>
    );
};
export default HeroSection;
