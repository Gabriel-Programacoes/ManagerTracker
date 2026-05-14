import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const results = [];
const seenIds = new Set(); // <-- Filtro para garantir IDs únicos na memória

console.log("⏳ Lendo o arquivo CSV...");

fs.createReadStream('players.csv')
    .pipe(csv())
    .on('data', (data) => {
        const id = parseInt(data['ID']);

        // Se não tiver ID ou se o ID já foi adicionado, ignoramos a linha
        if (isNaN(id) || seenIds.has(id)) return;

        seenIds.add(id);

        results.push({
            id: id,
            name: data['Name'] || 'Desconhecido',
            overall: parseInt(data['OVR']) || 0,
            position: data['Position'] || 'RES',
            age: parseInt(data['Age']) || 0,
            nation: data['Nation'],
            league: data['League'],
            team: data['Team'],
            pace: parseInt(data['PAC']) || null,
            shooting: parseInt(data['SHO']) || null,
            passing: parseInt(data['PAS']) || null,
            dribbling: parseInt(data['DRI']) || null,
            defending: parseInt(data['DEF']) || null,
            physicality: parseInt(data['PHY']) || null,
        });
    })
    .on('end', async () => {
        console.log(`✅ CSV lido com sucesso. Inserindo ${results.length} jogadores no banco de dados...`);

        try {
            const chunkSize = 1000;
            for (let i = 0; i < results.length; i += chunkSize) {
                const chunk = results.slice(i, i + chunkSize);

                // createMany limpo, sem o skipDuplicates que o SQLite não gosta
                await prisma.fifaPlayer.createMany({
                    data: chunk,
                });

                console.log(`Progresso: Inseridos ${Math.min(i + chunkSize, results.length)} de ${results.length}`);
            }

            console.log("🚀 Importação concluída com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao inserir no banco:", error);
        } finally {
            await prisma.$disconnect();
        }
    });