'use server'

import { sql } from "@/lib/db"
import { z } from "zod"
import { realms } from "@/config/realms"
import crypto from 'crypto'
import { calculateVerifier } from "@/lib/srp6"
import { registerAccount } from "./registertrinity"

const createAccountSchema = z.object({
  username: z.string().min(3).max(32),
  password: z.string().min(8),
  realmId: z.string().refine(id => id in realms, "Invalid realm")
})

export async function createGameAccount(
  masterAccountId: number,
  username: string,
  password: string,
  realmId: string
) {
  try {
    const validated = createAccountSchema.parse({ username, password, realmId })
    const realm = realms[validated.realmId as keyof typeof realms]
    
    // Check if username already exists
    const existingAccount = await sql(
      'SELECT id FROM auth.account WHERE username = ?',
      [validated.username.toUpperCase()]
    ) as any[]

    if (existingAccount.length > 0) {
      throw new Error('Username already exists')
    }
    
    // Create game account using existing trinity registration logic
    const result = await registerAccount(
      validated.username,
      'noreply@example.com',
      validated.password
    )
    
    if (result.error) {
      throw new Error(result.error)
    }
    
    // Get the created account's ID
    const account = await sql(
      'SELECT id FROM auth.account WHERE username = ?',
      [validated.username.toUpperCase()]
    ) as any[]
    
    // Link the account to the master account
    await sql(
      'INSERT INTO nimeracp.master_account_games (master_account_id, realm_id, game_account_id) VALUES (?, ?, ?)',
      [masterAccountId, Number(realm.id), account[0].id]
    )
    
    return { success: true }
  } catch (error) {
    console.error('Error creating game account:', error)
    throw error
  }
}

export async function getGameAccounts(masterAccountId: number) {
  try {
    const accounts = await sql(`
      SELECT 
        mag.id,
        acc.username,
        r.name as realmName,
        DATE_FORMAT(mag.created_at, '%Y-%m-%d %H:%i:%s') as createdAt,
        (SELECT COUNT(*) > 0 FROM characters.characters c WHERE c.account = acc.id) as hasCharacters,
        acc.locked as banned
      FROM nimeracp.master_account_games mag
      JOIN nimeracp.realms r ON r.id = mag.realm_id
      JOIN auth.account acc ON acc.id = mag.game_account_id
      WHERE mag.master_account_id = ?
      ORDER BY mag.created_at DESC
    `, [masterAccountId]) as any[]
        
    return accounts.map(account => ({
      ...account,
      username: account.username,
      realmName: account.realmName,
      createdAt: account.createdAt,
      hasCharacters: Boolean(account.hasCharacters)
    }))
  } catch (error) {
    console.error('Error fetching game accounts:', error)
    throw error
  }
} 