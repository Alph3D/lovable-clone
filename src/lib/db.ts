import { PrismaPg } from '@prisma/adapter-pg';

import { env } from '@/env/server';
import { PrismaClient } from '@/generated/prisma';

const pool = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: pool });

const globalForPrisma = global as unknown as { prisma: typeof prisma };

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const db = globalForPrisma.prisma;
