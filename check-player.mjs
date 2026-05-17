import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const p = await prisma.fifaPlayer.findFirst({ where: { position: 'ST' }, orderBy: { overall: 'desc' } });
console.log(JSON.stringify(p, null, 2));
const gk = await prisma.fifaPlayer.findFirst({ where: { position: 'GK' }, orderBy: { overall: 'desc' } });
console.log('GK:', JSON.stringify({ height: gk?.height, preferredFoot: gk?.preferredFoot, weakFoot: gk?.weakFoot, skillMoves: gk?.skillMoves, gkDiving: gk?.gkDiving, gkReflexes: gk?.gkReflexes }, null, 2));
await prisma.$disconnect();

