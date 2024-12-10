import crypto from 'crypto'

// Helper function to calculate SHA1 hash
function sha1(data: string): string {
  return crypto.createHash('sha1').update(data).digest('hex').toUpperCase()
}

// Helper function to verify TrinityCore's password hash
export function verifyTrinityPassword(username: string, password: string, storedHash: string): boolean {
  const calculatedHash = sha1(`${username.toUpperCase()}:${password.toUpperCase()}`)
  return calculatedHash === storedHash
} 