import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

const runtimeUrl = process.env.DATABASE_URL;

describe("Least-Privilege Runtime Role (portfolio_runtime) Verification", () => {
  let runtimePrisma: PrismaClient;

  beforeAll(() => {
    if (!runtimeUrl) {
      console.warn("DATABASE_URL not set — skipping live db-readonly tests");
      return;
    }
    runtimePrisma = new PrismaClient({
      datasources: {
        db: {
          url: runtimeUrl,
        },
      },
    });
  });

  afterAll(async () => {
    if (runtimePrisma) {
      await runtimePrisma.$disconnect();
    }
  });

  it("proves identity: current_user is portfolio_runtime and statement_timeout is 3s", async () => {
    if (!runtimeUrl) return;

    const userRes: Array<{ current_user: string }> =
      await runtimePrisma.$queryRawUnsafe(`SELECT current_user;`);
    expect(userRes[0]?.current_user).toBe("portfolio_runtime");

    const timeoutRes: Array<{ statement_timeout: string }> =
      await runtimePrisma.$queryRawUnsafe(`SHOW statement_timeout;`);
    expect(timeoutRes[0]?.statement_timeout).toBe("3s");
  }, 20000);

  it("Positive Read Test: SELECT on KnowledgeRecord succeeds and returns verified records", async () => {
    if (!runtimeUrl) return;

    const records = await runtimePrisma.knowledgeRecord.findMany({
      orderBy: { position: "asc" },
    });

    expect(records.length).toBe(27);
    expect(records.every((r) => r.body.length > 0)).toBe(true);
    expect(records.every((r) => r.title.length > 0)).toBe(true);

    const categories = new Set(records.map((r) => r.category));
    expect(categories.has("PROFILE")).toBe(true);
    expect(categories.has("EDUCATION")).toBe(true);
    expect(categories.has("EXPERIENCE")).toBe(true);
    expect(categories.has("SKILL")).toBe(true);
    expect(categories.has("PROJECT")).toBe(true);
    expect(categories.has("CERTIFICATION")).toBe(true);
    expect(categories.has("CONTACT")).toBe(true);
    expect(categories.has("GALLERY")).toBe(false); // 0 non-verified / draft records
  }, 20000);

  it("Negative Write Test 1: INSERT (create) fails with permission denied", async () => {
    if (!runtimeUrl) return;

    let threw = false;
    let errorMessage = "";
    try {
      await runtimePrisma.knowledgeRecord.create({
        data: {
          id: "project:malicious-injection",
          category: "PROJECT",
          title: "Unauthorized Injection",
          body: "This write must fail",
          keywords: ["fail"],
          source: "malicious",
        },
      });
    } catch (err: unknown) {
      threw = true;
      errorMessage = err instanceof Error ? err.message : String(err);
    }

    expect(threw).toBe(true);
    expect(errorMessage.toLowerCase()).toMatch(/permission denied|read-only/);
  });

  it("Negative Write Test 2: UPDATE fails with permission denied", async () => {
    if (!runtimeUrl) return;

    let threw = false;
    let errorMessage = "";
    try {
      await runtimePrisma.knowledgeRecord.update({
        where: { id: "profile:main" },
        data: {
          title: "Defaced Title",
        },
      });
    } catch (err: unknown) {
      threw = true;
      errorMessage = err instanceof Error ? err.message : String(err);
    }

    expect(threw).toBe(true);
    expect(errorMessage.toLowerCase()).toMatch(/permission denied|read-only/);
  });

  it("Negative Write Test 3: DELETE fails with permission denied", async () => {
    if (!runtimeUrl) return;

    let threw = false;
    let errorMessage = "";
    try {
      await runtimePrisma.knowledgeRecord.delete({
        where: { id: "profile:main" },
      });
    } catch (err: unknown) {
      threw = true;
      errorMessage = err instanceof Error ? err.message : String(err);
    }

    expect(threw).toBe(true);
    expect(errorMessage.toLowerCase()).toMatch(/permission denied|read-only/);
  });

  it("Negative Write Test 4: TRUNCATE fails with permission denied", async () => {
    if (!runtimeUrl) return;

    let threw = false;
    let errorMessage = "";
    try {
      await runtimePrisma.$executeRawUnsafe(`TRUNCATE TABLE "KnowledgeRecord";`);
    } catch (err: unknown) {
      threw = true;
      errorMessage = err instanceof Error ? err.message : String(err);
    }

    expect(threw).toBe(true);
    expect(errorMessage.toLowerCase()).toMatch(/permission denied|read-only/);
  });

  it("Negative Write Test 5: CREATE TABLE fails with permission denied", async () => {
    if (!runtimeUrl) return;

    let threw = false;
    let errorMessage = "";
    try {
      await runtimePrisma.$executeRawUnsafe(
        `CREATE TABLE unauthorized_table (id text primary key);`
      );
    } catch (err: unknown) {
      threw = true;
      errorMessage = err instanceof Error ? err.message : String(err);
    }

    expect(threw).toBe(true);
    expect(errorMessage.toLowerCase()).toMatch(/permission denied|read-only/);
  });

  it("Negative Write Test 6: DROP TABLE fails with permission denied", async () => {
    if (!runtimeUrl) return;

    let threw = false;
    let errorMessage = "";
    try {
      await runtimePrisma.$executeRawUnsafe(`DROP TABLE "KnowledgeRecord";`);
    } catch (err: unknown) {
      threw = true;
      errorMessage = err instanceof Error ? err.message : String(err);
    }

    expect(threw).toBe(true);
    expect(errorMessage.toLowerCase()).toMatch(/permission denied|read-only/);
  });
});
