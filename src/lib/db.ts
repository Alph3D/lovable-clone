import { PrismaPg } from '@prisma/adapter-pg';
import { attachDatabasePool } from '@vercel/functions';
import { Pool } from 'pg';

import { env } from '@/env/server';
import { PrismaClient } from '@/generated/prisma/client';

const pool = new Pool({ connectionString: env.DATABASE_URL });

attachDatabasePool(pool);

const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const globalForPrisma = global as unknown as { prisma: typeof prisma };

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const db = globalForPrisma.prisma;
