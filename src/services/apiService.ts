interface PreferencePayload {
  title: string;
  price: number;
  payer_firstname: string;
  payer_lastname: string;
  contacts_to_protect: string[];
  referral_code: string | null;
}

interface PreferenceResponse {
  init_point: string;
}

export const createCheckoutPreference = async (payload: PreferencePayload): Promise<PreferenceResponse> => {
  const response = await fetch("/create_preference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
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
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate a successful response
    // In a real scenario, this would be a fetch call to a backend endpoint.
    // e.g., const response = await fetch("/api/breach-report", ...);
    
    // Simulate random failure for testing
    if (Math.random() < 0.1) { // 10% chance of failure
         console.error("Simulated API error.");
         throw new Error("No se pudo enviar el reporte. Inténtelo de nuevo más tarde.");
    }
    
    console.log("Simulated API call successful.");
    return { success: true };
};
