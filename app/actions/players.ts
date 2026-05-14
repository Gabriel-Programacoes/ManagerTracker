'use server'

import { prisma } from '@/lib/prisma';

const PAGE_SIZE = 50;

export async function browseFifaPlayers(query: string, page: number = 0) {
    try {
        const where = query.trim().length >= 2
            ? { name: { contains: query.trim() } }
            : {};

        const [players, total] = await Promise.all([
            prisma.fifaPlayer.findMany({
                where,
                skip: page * PAGE_SIZE,
                take: PAGE_SIZE,
                orderBy: { overall: 'desc' },
            }),
            prisma.fifaPlayer.count({ where }),
        ]);

        return { players, total, page, pageSize: PAGE_SIZE };
    } catch (error) {
        console.error('Erro ao navegar jogadores:', error);
        return { players: [], total: 0, page: 0, pageSize: PAGE_SIZE };
    }
}

export async function searchFifaPlayers(query: string) {
    // Só pesquisa se houver pelo menos 2 letras
    if (!query || query.length < 2) return [];

    try {
        const players = await prisma.fifaPlayer.findMany({
            where: {
                name: {
                    contains: query,
                },
            },
            take: 8,
            orderBy: {
                overall: 'desc',
            },
        });

        return players;
    } catch (error) {
        console.error('Erro ao procurar jogadores:', error);
        return [];
    }
}