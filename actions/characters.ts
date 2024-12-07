'use server'

import { sql } from '@/lib/db'

export async function getCharacters(accountId: number) {
  const result = await sql(`
    SELECT 
      guid,
      name,
      race,
      class,
      level,
      gender
    FROM characters 
    WHERE account = ?
  `, [accountId]) as any[];
  return result;
}

export async function getCharacterDetails(guid: number) {
  const query = `
    SELECT 
      c.*,
      g.name as guild_name
    FROM characters c
    LEFT JOIN guild_member gm ON c.guid = gm.guid
    LEFT JOIN guild g ON gm.guildid = g.guildid
    WHERE c.guid = ?
  `;
  const result = await sql(query, [guid]) as any[];
  return result[0];
} 