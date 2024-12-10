'use server'

import crypto from 'crypto';
import { sql } from "@/lib/db";
import { calculateVerifier } from "@/lib/srp6";

export async function registerAccount(
  username: string,
  email: string,
  password: string
) {
  try {
    // Convert username to uppercase (TrinityCore standard)
    const upperUsername = username.toUpperCase();
    
    // Check if username already exists
    const existing = await sql(
      'SELECT 1 FROM account WHERE username = ?',
      [upperUsername]
    ) as any[];

    if (existing.length > 0) {
      return { error: 'Username already exists' };
    }

    // Generate random salt
    const salt = crypto.randomBytes(32);
    
    // Calculate verifier using exact same method as PHP
    const verifier = calculateVerifier(upperUsername, password, salt);

    // Insert new account
    await sql(`
      INSERT INTO account (
        username,
        salt,
        verifier,
        email,
        reg_mail,
        joindate,
        last_ip,
        last_attempt_ip,
        failed_logins,
        locked,
        lock_country,
        online,
        expansion,
        mutetime,
        locale,
        os,
        recruiter
      ) VALUES (
        ?, ?, ?, ?, ?, 
        NOW(),
        '127.0.0.1',
        '127.0.0.1',
        0,
        0,
        '00',
        0,
        2,
        0,
        0,
        'Win',
        0
      )
    `, [upperUsername, salt, verifier, email, email]);

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Failed to create account' };
  }
} 