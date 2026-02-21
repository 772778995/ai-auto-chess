import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://game_user:game_password@localhost:5432/game_db',
  },
  // 生成策略
  verbose: true,
  strict: true,
  // 迁移选项
  migrations: {
    tableName: 'drizzle_migrations',
    schema: 'public',
  },
})