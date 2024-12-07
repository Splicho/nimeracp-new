'use server'

import { sql } from '@/lib/db'

export async function getItemTemplate(entry: number) {
  const query = `
    SELECT 
      entry,
      name,
      Quality,
      ItemLevel,
      RequiredLevel
    FROM item_template 
    WHERE entry = ?
  `
  const result = await sql(query, [entry]) as any[];
  return result[0];
}

export async function searchItems(searchTerm: string) {
  const result = await sql(`
    SELECT 
      entry,
      name,
      Quality,
      ItemLevel
    FROM item_template 
    WHERE name LIKE ?
    LIMIT 10
  `, [`%${searchTerm}%`]) as any[];
  return result;
} 