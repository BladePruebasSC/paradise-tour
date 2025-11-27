// Utilidades para manejar códigos de referido desde la URL

export const getReferralCodeFromURL = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  
  return ref || null;
};

export const saveReferralCode = (code: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('referral_code', code);
  // Guardar también la fecha para expiración opcional
  localStorage.setItem('referral_code_date', new Date().toISOString());
};

export const getReferralCode = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('referral_code');
};

export const clearReferralCode = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('referral_code');
  localStorage.removeItem('referral_code_date');
};

// Detectar y guardar código de referido al cargar la página
export const initReferralCode = (): void => {
  const urlCode = getReferralCodeFromURL();
  if (urlCode) {
    saveReferralCode(urlCode);
    // Limpiar el parámetro de la URL sin recargar
    const url = new URL(window.location.href);
    url.searchParams.delete('ref');
    window.history.replaceState({}, '', url.toString());
  }
};

