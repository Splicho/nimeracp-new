export const realms = {
  frostgaard: {
    id: 1,
    name: 'Frostgaard',
    host: process.env.DB_HOST || 'localhost',
    port: 3724,
    databases: {
      auth: process.env.DB_AUTH || 'auth',
      characters: process.env.DB_CHARACTERS || 'characters',
      world: process.env.DB_WORLD || 'world',
    }
  },
  icevain: {
    id: 2,
    name: 'Icevain',
    host: process.env.DB_HOST || 'localhost',
    port: 3725,
    databases: {
      auth: process.env.DB_AUTH || 'auth',
      characters: process.env.DB_CHARACTERS_2 || 'characters2',
      world: process.env.DB_WORLD_2 || 'world2',
    }
  }
} as const

export type RealmId = keyof typeof realms 