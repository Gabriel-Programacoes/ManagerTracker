'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { normalizeFifaPosition, type DetailedPlayerInput } from '@/lib/player-utils';

export async function addPlayerToSquad(player: { id: number, name: string, overall: number, position: string }) {
    try {
        await prisma.squadPlayer.create({
            data: {
                fifaPlayerId: player.id,
                name: player.name,
                position: normalizeFifaPosition(player.position),
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

        const fifaMap = new Map<number, {
            pace: number | null; shooting: number | null; passing: number | null;
            dribbling: number | null; defending: number | null; physicality: number | null;
            age: number;
            height: number | null; weight: number | null;
            preferredFoot: string | null; weakFoot: number | null; skillMoves: number | null;
            playstyle: string | null;
            gkDiving: number | null; gkHandling: number | null; gkKicking: number | null;
            gkPositioning: number | null; gkReflexes: number | null;
        }>();

        if (fifaIds.length > 0) {
            const fifaPlayers = await prisma.fifaPlayer.findMany({
                where: { id: { in: fifaIds } },
                select: {
                    id: true,
                    pace: true, shooting: true, passing: true, dribbling: true, defending: true, physicality: true,
                    age: true, height: true, weight: true,
                    preferredFoot: true, weakFoot: true, skillMoves: true, playstyle: true,
                    gkDiving: true, gkHandling: true, gkKicking: true, gkPositioning: true, gkReflexes: true,
                },
            });
            for (const fp of fifaPlayers) fifaMap.set(fp.id, fp);
        }

        // Merge FIFA attributes into squad players
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
                physical:  fifa.physicality,
                age:       p.age ?? fifa.age,
                height:    p.height ?? fifa.height,
                feet:      p.feet ?? fifa.preferredFoot,
                weakFoot:  p.weakFoot ?? fifa.weakFoot,
                skillMoves: p.skillMoves ?? fifa.skillMoves,
                playstyle: p.playstyle ?? fifa.playstyle,
                gkDiving:      fifa.gkDiving,
                gkHandling:    fifa.gkHandling,
                gkKicking:     fifa.gkKicking,
                gkPositioning: fifa.gkPositioning,
                gkReflexes:    fifa.gkReflexes,
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
    const overall = data.overall;
    const isGK = data.position === "GOL";
    try {
        await prisma.squadPlayer.create({
            data: {
                name: data.name,
                position: data.position,
                currentOverall: overall,
                marketValue:   data.marketValue,
                salary:        data.salary,
                contractYears: data.contractYears,
                pace:       isGK ? undefined : data.pace,
                shooting:   isGK ? undefined : data.shooting,
                passing:    isGK ? undefined : data.passing,
                dribbling:  isGK ? undefined : data.dribbling,
                defending:  isGK ? undefined : data.defending,
                physical:   isGK ? undefined : data.physical,
                age:        data.age,
                height:     data.height,
                feet:       data.feet,
                skillMoves: data.skillMoves,
                weakFoot:   data.weakFoot,
                playstyle:  data.playstyle,
                gkDiving:      isGK ? data.gkDiving      : undefined,
                gkHandling:    isGK ? data.gkHandling     : undefined,
                gkKicking:     isGK ? data.gkKicking      : undefined,
                gkPositioning: isGK ? data.gkPositioning  : undefined,
                gkReflexes:    isGK ? data.gkReflexes     : undefined,
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
    awardBallondOr: boolean;
    awardMonthlyBest: number;
    awardMotm: number;
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

/* ── Estatísticas da temporada ──────────────────────────── */

export type SeasonStats = {
    goals: number;
    assists: number;
    matches: number;
    yellowCards: number;
    redCards: number;
    cleanSheets: number;
};

export async function updatePlayerStats(id: string, data: SeasonStats) {
    try {
        await prisma.squadPlayer.update({ where: { id }, data });
        revalidatePath('/squad');
        return { success: true };
    } catch (error) {
        console.error('Erro ao atualizar estatísticas:', error);
        return { success: false };
    }
}

