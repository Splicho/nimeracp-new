'use server'

import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.string().email(),
  password: z.string().min(8)
})

export async function registerMasterAccount(
  username: string, 
  email: string, 
  password: string
) {
  try {
    // Validate input
    const validated = registerSchema.parse({ username, email, password })
    
    // Check if username or email exists
    const existing = await sql(
      'SELECT username, email FROM nimeracp.master_accounts WHERE username = ? OR email = ?',
      [validated.username, validated.email]
    ) as any[]
    
    if (existing.length > 0) {
      throw new Error('Username or email already exists')
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(validated.password, 10)
    
    // Create account
    const result = await sql(
      'INSERT INTO nimeracp.master_accounts (username, email, password_hash) VALUES (?, ?, ?)',
      [validated.username, validated.email, passwordHash]
    ) as any[]
    
    return { success: true }
  } catch (error) {
    console.error('Error registering master account:', error)
    throw error
  }
}

export async function verifyMasterAccount(
  username: string,
  password: string
) {
  try {
    const account = await sql(
      'SELECT id, username, email, password_hash FROM nimeracp.master_accounts WHERE username = ?',
      [username]
    ) as any[]
    
    if (!account[0]) {
      return null
    }

    const valid = await bcrypt.compare(password, account[0].password_hash)
    
    if (!valid) {
      return null
    }

    // Update last login
    await sql(
      'UPDATE nimeracp.master_accounts SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [account[0].id]
    )
    
    return {
      id: account[0].id,
      username: account[0].username,
      email: account[0].email
    }
  } catch (error) {
    console.error('Error verifying master account:', error)
    throw error
  }
}
