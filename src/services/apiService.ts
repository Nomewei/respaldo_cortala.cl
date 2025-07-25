interface PreferencePayload {
  title: string;
  price: number;
  payer_firstname: string;
  payer_lastname: string;
  contacts_to_protect: string[];
  referral_code: string | null;
  new_referral_code: string;
}

interface PreferenceResponse {
  init_point: string;
}

export const createCheckoutPreference = async (payload: PreferencePayload): Promise<PreferenceResponse> => {
    // El backend usará el new_referral_code para construir la URL de éxito.
    // Aquí lo simulamos para que el frontend pueda manejarlo.
    const successUrl = `${window.location.origin}/?status=success&newRef=${payload.new_referral_code}`;

    const apiPayload = { ...payload, back_urls: { success: successUrl } };


    const response = await fetch("/create_preference", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
    });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error del servidor al crear la preferencia de pago.');
  }

  return response.json();
};


export interface BreachReportPayload {
    name: string;
    email: string;
    spamSource: string;
    details: string;
}

export const submitBreachReport = async (payload: BreachReportPayload): Promise<{ success: boolean }> => {
    console.log("Submitting breach report:", payload);
    
    // Simula una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (Math.random() < 0.1) {
         console.error("Simulated API error.");
         throw new Error("No se pudo enviar el reporte. Inténtelo de nuevo más tarde.");
    }
    
    console.log("Simulated API call successful.");
    return { success: true };
};
