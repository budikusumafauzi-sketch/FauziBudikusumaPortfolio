import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import fs from "fs";

async function main() {
  const privilegedUrl =
    process.env.MIGRATION_DATABASE_URL || process.env.DATABASE_URL;
  if (!privilegedUrl) {
    throw new Error("MIGRATION_DATABASE_URL not found in environment");
  }

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: privilegedUrl,
      },
    },
  });

  const runtimePassword = crypto.randomBytes(24).toString("base64url");
  console.log(
    "[ROLE SETUP] Generating secure runtime password for portfolio_runtime: [REDACTED]"
  );

  try {
    // 1. Create or update role
    console.log(
      "[ROLE SETUP] Executing CREATE/ALTER ROLE portfolio_runtime in PostgreSQL..."
    );
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'portfolio_runtime') THEN
          CREATE ROLE portfolio_runtime LOGIN PASSWORD '${runtimePassword}';
        ELSE
          ALTER ROLE portfolio_runtime WITH PASSWORD '${runtimePassword}';
        END IF;
      END
      $$;
    `);

    // 2. Grant CONNECT & USAGE
    console.log(
      "[ROLE SETUP] Granting CONNECT on database and USAGE on schema public..."
    );
    await prisma.$executeRawUnsafe(
      `GRANT CONNECT ON DATABASE neondb TO portfolio_runtime;`
    );
    await prisma.$executeRawUnsafe(
      `GRANT USAGE ON SCHEMA public TO portfolio_runtime;`
    );

    // 3. Table privileges
    console.log(
      '[ROLE SETUP] Restricting tables to SELECT on "KnowledgeRecord" ONLY...'
    );
    await prisma.$executeRawUnsafe(
      `REVOKE ALL ON ALL TABLES IN SCHEMA public FROM portfolio_runtime;`
    );
    await prisma.$executeRawUnsafe(
      `GRANT SELECT ON TABLE "KnowledgeRecord" TO portfolio_runtime;`
    );
    await prisma.$executeRawUnsafe(
      `REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE "KnowledgeRecord" FROM portfolio_runtime;`
    );

    // 4. Session defaults & timeout
    console.log(
      "[ROLE SETUP] Setting statement_timeout = 3s and default_transaction_read_only = on..."
    );
    await prisma.$executeRawUnsafe(
      `ALTER ROLE portfolio_runtime SET statement_timeout = '3s';`
    );
    await prisma.$executeRawUnsafe(
      `ALTER ROLE portfolio_runtime SET default_transaction_read_only = on;`
    );

    console.log("[ROLE SETUP] Role configuration in PostgreSQL completed successfully.");
  } finally {
    await prisma.$disconnect();
  }

  // Build the direct runtime URL with portfolio_runtime
  const directRuntimeUrl = new URL(privilegedUrl);
  directRuntimeUrl.username = "portfolio_runtime";
  directRuntimeUrl.password = runtimePassword;

  // Let's also check if DATABASE_URL in .env was pooled
  const envContent = fs.readFileSync(".env", "utf8");
  const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);

  let pooledRuntimeUrl: string | null = null;
  if (dbUrlMatch) {
    try {
      const u = new URL(dbUrlMatch[1]);
      u.username = "portfolio_runtime";
      u.password = runtimePassword;
      pooledRuntimeUrl = u.toString();
    } catch {
      // ignore
    }
  }

  console.log("[ROLE TEST] Testing live connection as portfolio_runtime...");

  // Test direct connection first
  const testUrl = directRuntimeUrl.toString();
  const directPrisma = new PrismaClient({
    datasources: { db: { url: testUrl } },
  });

  try {
    const userResult: Array<{ current_user: string }> =
      await directPrisma.$queryRawUnsafe(`SELECT current_user;`);
    console.log(
      "[ROLE TEST] Direct connection current_user:",
      userResult[0]?.current_user
    );
    const timeoutResult: Array<{ statement_timeout: string }> =
      await directPrisma.$queryRawUnsafe(`SHOW statement_timeout;`);
    console.log(
      "[ROLE TEST] Direct connection statement_timeout:",
      timeoutResult[0]?.statement_timeout
    );
  } finally {
    await directPrisma.$disconnect();
  }

  let preferredUrl = testUrl;

  if (pooledRuntimeUrl) {
    console.log("[ROLE TEST] Testing pooled connection as portfolio_runtime...");
    const pooledPrisma = new PrismaClient({
      datasources: { db: { url: pooledRuntimeUrl } },
    });
    try {
      const pUser: Array<{ current_user: string }> =
        await pooledPrisma.$queryRawUnsafe(`SELECT current_user;`);
      console.log(
        "[ROLE TEST] Pooled connection current_user:",
        pUser[0]?.current_user
      );
      const pTimeout: Array<{ statement_timeout: string }> =
        await pooledPrisma.$queryRawUnsafe(`SHOW statement_timeout;`);
      console.log(
        "[ROLE TEST] Pooled connection statement_timeout:",
        pTimeout[0]?.statement_timeout
      );
      preferredUrl = pooledRuntimeUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log("[ROLE TEST] Pooled connection notice:", msg);
      console.log(
        "[ROLE TEST] Using verified direct endpoint for runtime connection."
      );
      preferredUrl = testUrl;
    } finally {
      await pooledPrisma.$disconnect();
    }
  }

  // Update .env with preferredUrl as DATABASE_URL
  const newEnvLines = [
    "# Local PostgreSQL connection strings (untracked)",
    `DATABASE_URL="${preferredUrl}"`,
    `MIGRATION_DATABASE_URL="${privilegedUrl}"`,
    "",
  ];
  fs.writeFileSync(".env", newEnvLines.join("\n"), "utf8");
  console.log(
    "[ROLE SETUP] Updated .env: DATABASE_URL is now configured with role portfolio_runtime; MIGRATION_DATABASE_URL is privileged owner (all credentials [REDACTED])."
  );
}

main().catch((err) => {
  console.error("[ROLE SETUP ERROR]", err);
  process.exit(1);
});
