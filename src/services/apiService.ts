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
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error del servidor.');
  }
  return response.json();
};
