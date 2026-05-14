'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { calcOverall, type DetailedPlayerInput } from '@/lib/player-utils';

export async function addPlayerToSquad(player: { id: number, name: string, overall: number, position: string }) {
    try {
        await prisma.squadPlayer.create({
            data: {
                fifaPlayerId: player.id,
                name: player.name,
                position: player.position,
                currentOverall: player.overall,
            }
        });
        revalidatePath('/squad');
        return { success: true };
    } catch (error) {
        console.error('Erro ao adicionar jogador:', error);
        return { success: false };
    }
}

export async function getMySquad() {
    try {
        const squadPlayers = await prisma.squadPlayer.findMany({
            orderBy: { currentOverall: 'desc' },
        });

        // Collect FIFA IDs to bulk-fetch attributes
        const fifaIds = squadPlayers
            .filter((p) => p.fifaPlayerId != null)
            .map((p) => p.fifaPlayerId as number);

        const fifaMap = new Map<number, { pace: number | null; shooting: number | null; passing: number | null; dribbling: number | null; defending: number | null; physicality: number | null; age: number }>();

        if (fifaIds.length > 0) {
            const fifaPlayers = await prisma.fifaPlayer.findMany({
                where: { id: { in: fifaIds } },
                select: { id: true, pace: true, shooting: true, passing: true, dribbling: true, defending: true, physicality: true, age: true },
            });
            for (const fp of fifaPlayers) fifaMap.set(fp.id, fp);
        }

        // Merge FIFA attributes into squad players (pace/shooting/etc.)
        return squadPlayers.map((p) => {
            if (p.fifaPlayerId == null) return p;
            const fifa = fifaMap.get(p.fifaPlayerId);
            if (!fifa) return p;
            return {
                ...p,
                pace:      fifa.pace,
                shooting:  fifa.shooting,
                passing:   fifa.passing,
                dribbling: fifa.dribbling,
                defending: fifa.defending,
                physical:  fifa.physicality, // matches SquadPlayer type key
                // Use FIFA age only if squad record has none (future: squad could override)
            };
        });
    } catch (error) {
        return [];
    }
}

export async function addCustomPlayerToSquad(data: {
    name: string;
    position: string;
    overall: number;
    marketValue?: number;
    salary?: number;
    contractYears?: number;
}) {
    try {
        await prisma.squadPlayer.create({
            data: {
                name: data.name,
                position: data.position,
                currentOverall: data.overall,
                marketValue:   data.marketValue   ?? 0,
                salary:        data.salary        ?? 0,
                contractYears: data.contractYears ?? 1,
            }
        });
        revalidatePath('/squad');
        return { success: true };
    } catch (error) {
        console.error('Erro ao criar jogador manual:', error);
        return { success: false };
    }
}

export async function createDetailedPlayer(data: DetailedPlayerInput) {
    const overall = calcOverall(
        data.position,
        data.pace, data.shooting, data.passing,
        data.dribbling, data.defending, data.physical,
    );
    try {
        await prisma.squadPlayer.create({
            data: {
                name: data.name,
                position: data.position,
                currentOverall: overall,
                marketValue:   data.marketValue,
                salary:        data.salary,
                contractYears: data.contractYears,
            },
        });
        revalidatePath('/squad');
        return { success: true, overall };
    } catch (error) {
        console.error('Erro ao criar jogador detalhado:', error);
        return { success: false, overall };
    }
}

/* ── Contrato, finanças e prêmios ───────────────────────── */

export type ContractData = {
    marketValue: number;
    salary: number;
    contractYears: number;
    awardPlayerOfSeason: boolean;
    awardTopScorer: boolean;
    awardBestGoalkeeper: boolean;
    awardBestYoungPlayer: boolean;
    awardBestDefender: boolean;
};

export async function updatePlayerContract(id: string, data: Partial<ContractData>) {
    try {
        await prisma.squadPlayer.update({ where: { id }, data });
        revalidatePath('/squad');
        return { success: true };
    } catch (error) {
        console.error('Erro ao atualizar contrato:', error);
        return { success: false };
    }
}
