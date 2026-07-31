import { updateGoldCache } from "@/lib/gold/updateGoldCache";

async function main() {
    const cache = await updateGoldCache();
    console.log(`gold.json updated: ${cache.sourceName} ${cache.updatedAt}`);
}

main().catch((error) => {
    console.error("gold.json update failed:", error);
    process.exit(1);
});
