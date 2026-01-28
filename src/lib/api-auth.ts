import { getApiEnabled } from './settings';

export function getApiSecret(): string {
  return process.env.API_SECRET || '';
}

export async function validateApiRequest(request: Request): Promise<{ authorized: boolean; message?: string }> {
  const apiEnabled = await getApiEnabled();
  
  if (!apiEnabled) {
    return { authorized: false, message: 'API is disabled' };
  }

  const apiSecret = getApiSecret();
  
  if (!apiSecret) {
    return { authorized: false, message: 'API secret not configured' };
  }

  const authHeader = request.headers.get('Authorization');
  const providedSecret = request.headers.get('X-API-Secret');

  // Check both Authorization header and X-API-Secret header
  if (authHeader === `Bearer ${apiSecret}` || providedSecret === apiSecret) {
    return { authorized: true };
  }

  return { authorized: false, message: 'Invalid API credentials' };
}
