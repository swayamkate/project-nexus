/**
 * Empathetic and Human-Readable Error Message Formatter for Admin Console
 */
export function formatHumanError(error: any): string {
  if (!error) return 'An unexpected administrative error occurred. Please try again.';

  const message = typeof error === 'string' 
    ? error 
    : (error.message || error.error_description || error.error || JSON.stringify(error));

  const code = error.code || '';

  // 1. Duplicate unique constraints
  if (message.includes('duplicate key') || message.includes('already exists') || code === '23505') {
    if (message.includes('email')) {
      return 'An administrator or trainee with this email is already registered in the system.';
    }
    if (message.includes('username')) {
      return 'This administrative handle is already assigned. Please choose another username.';
    }
    return 'A conflicting record already exists in the State Skilling Registry.';
  }

  // 2. Auth & Session Errors
  if (message.includes('Invalid') || message.includes('invalid_credentials')) {
    return 'Invalid administrative credentials or unconfirmed account. Please check your inputs.';
  }

  if (message.includes('JWT') || message.includes('token is expired') || message.includes('session expired')) {
    return 'Administrative session timed out. Please authenticate again to access the Executive Console.';
  }

  // 3. Row Level Security & Access Denied
  if (message.includes('row-level security') || message.includes('permission denied') || code === '42501') {
    return 'Restricted Access: Your account does not have Superadmin privileges for this operation.';
  }

  // 4. Rate Limiting & Cooldowns
  if (message.includes('rate limit') || message.includes('too many requests') || error.status === 429) {
    return 'Rate limit reached. Please wait a minute before sending another batch operation.';
  }

  // 5. Network & Offline Connectivity
  if (message.includes('Failed to fetch') || message.includes('NetworkError') || message.includes('ECONNREFUSED')) {
    return 'Unable to reach PostgreSQL cluster gateway (https://api.avishkark.in). Please check network routing.';
  }

  return message.replace(/^[a-zA-Z]+Error:\s*/, '').replace(/\{.*\}/, '').trim() || 'Administrative operation could not be completed.';
}
