import crypto from 'crypto';

// TrinityCore constants
const N_str = "894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7";
const g = 7n;
const N = BigInt(`0x${N_str}`);

function reverseBuffer(buffer: Buffer): Buffer {
  const reversed = Buffer.alloc(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    reversed[i] = buffer[buffer.length - 1 - i];
  }
  return reversed;
}

export function calculateVerifier(username: string, password: string, salt: Buffer): Buffer {
  // Match PHP's implementation exactly:
  // $h1 = sha1(strtoupper($username . ':' . $password), TRUE);
  const h1 = crypto.createHash('sha1')
    .update(`${username}:${password}`.toUpperCase())
    .digest();

  // $h2 = sha1($salt . $h1, TRUE);
  const h2 = crypto.createHash('sha1')
    .update(Buffer.concat([salt, h1]))
    .digest();

  // Convert to little-endian (GMP_LSW_FIRST)
  const h2Reversed = reverseBuffer(h2);
  
  // Calculate verifier: g^h2 % N
  const x = BigInt('0x' + h2Reversed.toString('hex'));
  const verifier = powerMod(g, x, N);
  
  // Convert back to little-endian 32-byte buffer
  const verifierHex = verifier.toString(16).padStart(64, '0');
  const verifierBuffer = Buffer.from(verifierHex, 'hex');
  return reverseBuffer(verifierBuffer);
}

function powerMod(base: bigint, exponent: bigint, modulus: bigint): bigint {
  let result = 1n;
  base = base % modulus;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    base = (base * base) % modulus;
    exponent = exponent / 2n;
  }
  return result;
} 