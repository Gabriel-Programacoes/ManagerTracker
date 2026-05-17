import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const r = await prisma.fifaPlayer.deleteMany();
console.log('FIFA players deletados:', r.count);
await prisma.$disconnect();

