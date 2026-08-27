/**
 * Empathetic and Human-Readable Error Message Formatter
 * Translates low-level database, network, and auth exceptions into clear, friendly guidance.
 */
export function formatHumanError(error: any): string {
  if (!error) return 'An unexpected situation occurred. Please try again.';

  const message = typeof error === 'string' 
    ? error 
    : (error.message || error.error_description || error.error || JSON.stringify(error));

  const code = error.code || '';

  // 1. Duplicate unique constraints (e.g. Email or Username already registered)
  if (message.includes('duplicate key') || message.includes('already exists') || code === '23505') {
    if (message.includes('email')) {
      return 'An account with this email address is already registered. Would you like to sign in instead?';
    }
    if (message.includes('username')) {
      return 'This username is already claimed by another trainee. Please try a different username.';
    }
    return 'This record already exists in the Maharashtra Skilling Registry.';
  }

  // 2. Auth & Session Errors
  if (message.includes('Invalid login credentials') || message.includes('invalid_credentials')) {
    return 'Incorrect email/username or password. Please verify your credentials and try again.';
  }

  if (message.includes('Email not confirmed') || message.includes('email_not_confirmed')) {
    return 'Your email address is not yet verified. Please enter the 6-digit OTP code sent to your inbox to activate your profile.';
  }

  if (message.includes('JWT') || message.includes('token is expired') || message.includes('session expired')) {
    return 'Your security session has expired. Please log in again to continue safely.';
  }

  // 3. Row Level Security & Access Denied
  if (message.includes('row-level security') || message.includes('permission denied') || code === '42501') {
    return 'Access Restricted: You do not have permission to modify this registry entry. Please contact your District Mission Officer.';
  }

  // 4. Rate Limiting & Cooldowns
  if (message.includes('rate limit') || message.includes('too many requests') || error.status === 429) {
    return 'Too many attempts in a short period. For your security, please wait 60 seconds before trying again.';
  }

  // 5. Network & Offline Connectivity
  if (message.includes('Failed to fetch') || message.includes('NetworkError') || message.includes('ECONNREFUSED')) {
    return 'Unable to connect to the state registry gateway. Please check your internet connection and try again.';
  }

  // 6. Form & Validation Errors
  if (message.includes('validation') || message.includes('invalid input syntax')) {
    return 'Please double-check the highlighted fields to ensure all required information is formatted correctly.';
  }

  // Clean default fallback (strip raw stack traces or JSON braces)
  return message.replace(/^[a-zA-Z]+Error:\s*/, '').replace(/\{.*\}/, '').trim() || 'Operation could not be completed. Please try again.';
}
