import * as crypto from 'crypto';

/**
 * Generates human-readable, unique distributed job IDs matching the pattern #job-XXXXXX
 * (e.g. #job-9a8f2c)
 */
export function generateJobId(): string {
  const hex = crypto.randomBytes(3).toString('hex');
  return `#job-${hex}`;
}
