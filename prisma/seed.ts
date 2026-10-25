import { PrismaClient } from "@prisma/client";
import {
  buildKnowledgeRecords,
  KnowledgeRecordInput,
  KnowledgeRecordInputSchema,
  assertPrivacySafe,
} from "../src/data/chatbot-knowledge";
import { TOTAL_KNOWLEDGE_MAX_CHARS } from "../src/lib/chat-contract";

interface TargetInfo {
  host: string;
  database: string;
}

function parseTargetInfo(connectionUrl: string): TargetInfo {
  try {
    const url = new URL(connectionUrl);
    return {
      host: url.hostname,
      database: url.pathname.replace(/^\//, ""),
    };
  } catch {
    return {
      host: "unknown-host",
      database: "unknown-db",
    };
  }
}

export async function seed(options?: {
  confirmDb?: string;
  prune?: boolean;
  recordsOverride?: KnowledgeRecordInput[];
}) {
  const privilegedUrl =
    process.env.MIGRATION_DATABASE_URL || process.env.DATABASE_URL;

  if (!privilegedUrl) {
    throw new Error(
      "Seeding aborted: MIGRATION_DATABASE_URL or DATABASE_URL must be defined."
    );
  }

  const target = parseTargetInfo(privilegedUrl);
  console.log(`[SEED PRE-FLIGHT] Target Database Host: ${target.host} (credentials [REDACTED])`);
  console.log(`[SEED PRE-FLIGHT] Target Database Name: ${target.database}`);

  // Confirmation flag requirement (SCHEMA.md §7)
  const passedConfirm =
    options?.confirmDb ||
    process.env.SEED_CONFIRM_DB ||
    process.argv.find((arg) => arg.startsWith("--confirm-db="))?.split("=")[1] ||
    (process.argv.includes("--confirm") ? target.database : undefined);

  if (passedConfirm !== target.database) {
    throw new Error(
      `Seeding aborted: Target confirmation required. Please pass --confirm-db=${target.database} or set SEED_CONFIRM_DB=${target.database}`
    );
  }

  // 1. Build and validate all records BEFORE touching the database
  const records = options?.recordsOverride ?? buildKnowledgeRecords();
  console.log(`[SEED VALIDATION] Validating ${records.length} records prior to transaction...`);

  let totalKnowledgeChars = 0;
  for (const record of records) {
    KnowledgeRecordInputSchema.parse(record);
    assertPrivacySafe(record);
    const serialized = `[${record.id}] ${record.category} | ${record.title}\n${record.body}${record.url ? `\nURL: ${record.url}` : ''}`;
    totalKnowledgeChars += serialized.length + 5; // including separator '\n\n---\n\n'
  }
  if (totalKnowledgeChars > TOTAL_KNOWLEDGE_MAX_CHARS) {
    throw new Error(
      `Seeding aborted: Serialized verified knowledge context (${totalKnowledgeChars} chars) exceeds hard limit of ${TOTAL_KNOWLEDGE_MAX_CHARS} characters.`,
    );
  }
  console.log(
    `[SEED VALIDATION] All ${records.length} records passed Zod & Privacy validation. Total context size: ${totalKnowledgeChars} / ${TOTAL_KNOWLEDGE_MAX_CHARS} chars.`
  );

  // 2. Instantiate privileged PrismaClient
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: privilegedUrl,
      },
    },
  });

  try {
    // 3. Optional prune dry-run and execution
    const shouldPrune =
      options?.prune || process.argv.includes("--prune");

    if (shouldPrune) {
      const activeIds = new Set(records.map((r) => r.id));
      const existing = await prisma.knowledgeRecord.findMany({
        select: { id: true, source: true },
      });
      const toDelete = existing.filter((item) => !activeIds.has(item.id));

      console.log(`[SEED PRUNE] Dry-run: Found ${toDelete.length} obsolete records to prune:`);
      for (const item of toDelete) {
        console.log(`  - [PRUNE CANDIDATE] ID: ${item.id} (source: ${item.source})`);
      }

      if (toDelete.length > 0) {
        await prisma.knowledgeRecord.deleteMany({
          where: {
            id: { in: toDelete.map((i) => i.id) },
          },
        });
        console.log(`[SEED PRUNE] Successfully pruned ${toDelete.length} obsolete records.`);
      }
    }

    // 4. Upsert all records in one atomic transaction
    console.log(`[SEED TRANSACTION] Writing ${records.length} records in a single transaction...`);
    await prisma.$transaction(
      records.map((record) =>
        prisma.knowledgeRecord.upsert({
          where: { id: record.id },
          create: {
            id: record.id,
            category: record.category,
            title: record.title,
            body: record.body,
            keywords: record.keywords,
            url: record.url,
            position: record.position,
            source: record.source,
          },
          update: {
            category: record.category,
            title: record.title,
            body: record.body,
            keywords: record.keywords,
            url: record.url,
            position: record.position,
            source: record.source,
          },
        })
      )
    );

    // 5. Verification queries
    const totalCount = await prisma.knowledgeRecord.count();
    const categories = await prisma.knowledgeRecord.groupBy({
      by: ["category"],
      _count: { id: true },
    });

    console.log(`[SEED COMPLETE] Database now contains ${totalCount} KnowledgeRecords.`);
    console.log(`[SEED SUMMARY] Breakdown by category:`);
    for (const cat of categories) {
      console.log(`  - ${cat.category}: ${cat._count.id} records`);
    }

    return { totalCount, categories };
  } finally {
    await prisma.$disconnect();
  }
}

// Auto-run if executed directly via CLI
if (process.argv[1]?.endsWith("seed.ts")) {
  seed()
    .then(() => {
      console.log("[SEED] Execution finished successfully with exit code 0.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("[SEED ERROR]", err.message);
      process.exit(1);
    });
}
