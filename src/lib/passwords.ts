import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password securely using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifies a plaintext password against a stored bcrypt hash or legacy string safely.
 * Never logs passwords or throws raw errors.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  try {
    // If stored hash is a bcrypt hash (starts with $2a$, $2b$, or $2y$)
    if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
      return await bcrypt.compare(password, hash);
    }
    // Fallback for pre-existing dev/mock seed records to prevent locking existing test accounts
    return password === hash;
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}
