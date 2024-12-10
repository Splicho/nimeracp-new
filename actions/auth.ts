"use server";

import crypto from "crypto";
import { sql } from "@/lib/db";
import { calculateVerifier } from "@/lib/srp6";

// Helper function to calculate SHA1 hash
function sha1(data: string): string {
  return crypto.createHash("sha1").update(data).digest("hex").toUpperCase();
}

// Helper function to verify TrinityCore's password hash
function verifyTrinityPassword(
  username: string,
  password: string,
  storedHash: string
): boolean {
  // TrinityCore uses username:password format hashed with SHA1
  const calculatedHash = sha1(
    `${username.toUpperCase()}:${password.toUpperCase()}`
  );
  return calculatedHash === storedHash;
}

// Add the role mapping at the top
const SECURITY_LEVELS = {
  0: "Player",
  1: "Moderator",
  2: "Game Master",
  3: "Administrator",
} as const;

export async function getAccount(username: string) {
  const result = (await sql("SELECT * FROM account WHERE username = ?", [
    username,
  ])) as any[];
  return result[0];
}

export async function verifyAccount(username: string, password: string) {
  try {
    const upperUsername = username.toUpperCase();

    const accounts = (await sql(
      `
      SELECT a.id, a.username, a.email, a.salt, a.verifier, COALESCE(aa.SecurityLevel, 0) as role
      FROM account a 
      LEFT JOIN account_access aa ON a.id = aa.AccountID 
      WHERE a.username = ?
    `,
      [upperUsername]
    )) as any[];

    if (!accounts?.[0]) {
      return null;
    }

    const account = accounts[0];
    ({
      id: account.id,
      username: account.username,
      role: account.role,
    });

    // Convert binary fields to Buffers
    const saltBuffer = Buffer.from(account.salt);
    const verifierBuffer = Buffer.from(account.verifier);

    // Calculate verifier using same method as registration
    const calculatedVerifier = calculateVerifier(
      upperUsername,
      password,
      saltBuffer
    );

    ({
      saltHex: saltBuffer.toString("hex"),
      storedVerifierHex: verifierBuffer.toString("hex"),
      calculatedVerifierHex: calculatedVerifier.toString("hex"),
    });

    // Compare the calculated verifier with the stored one
    const isValid = Buffer.compare(calculatedVerifier, verifierBuffer) === 0;

    if (!isValid) {
      return null;
    }

    const securityLevel = parseInt(account.role) || 0;
    ({
      raw: account.role,
      parsed: securityLevel,
      mapped: SECURITY_LEVELS[securityLevel as keyof typeof SECURITY_LEVELS],
    });

    return {
      id: account.id,
      username: account.username,
      email: account.email,
      role: SECURITY_LEVELS[securityLevel as keyof typeof SECURITY_LEVELS],
      securityLevel: securityLevel,
    };
  } catch (error) {
    return null;
  }
}
