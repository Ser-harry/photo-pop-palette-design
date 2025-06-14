
/**
 * Sanitizes and validates input strings
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove dangerous characters
  return input
    .replace(/[<>\"']/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .trim();
};

/**
 * Validates slug format
 */
export const isValidSlug = (slug: string): boolean => {
  if (!slug || typeof slug !== 'string') return false;
  
  // Allow only lowercase letters, numbers, and hyphens
  // Length between 1 and 100 characters
  return /^[a-z0-9-]{1,100}$/.test(slug);
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validates admin role
 */
export const isValidAdminRole = (role: string): boolean => {
  const validRoles = ['super_admin', 'admin', 'moderator'];
  return validRoles.includes(role);
};

/**
 * Escapes HTML to prevent XSS
 */
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Rate limiting check (basic client-side)
 */
export const checkRateLimit = (key: string, maxRequests: number, windowMs: number): boolean => {
  const now = Date.now();
  const requests = JSON.parse(localStorage.getItem(`rateLimit_${key}`) || '[]');
  
  // Remove old requests outside the window
  const validRequests = requests.filter((timestamp: number) => now - timestamp < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  // Add current request
  validRequests.push(now);
  localStorage.setItem(`rateLimit_${key}`, JSON.stringify(validRequests));
  
  return true;
};
