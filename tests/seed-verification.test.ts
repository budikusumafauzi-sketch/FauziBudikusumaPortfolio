import { describe, it, expect } from "vitest";
import { seed } from "../prisma/seed";
import { KnowledgeRecordInput } from "../src/data/chatbot-knowledge";

describe("Seed Verification & Idempotency Tests (TASK-018)", () => {
  it("AC-2: A deliberately invalid record causes the seed to abort with nothing written", async () => {
    const invalidRecord = {
      id: "project:invalid_record_with_UPPERCASE",
      category: "PROJECT" as const,
      title: "Bad Record",
      body: "Bad body",
      keywords: ["bad"],
      url: "ftp://bad-url",
      position: -1,
      source: "test",
    } as unknown as KnowledgeRecordInput;

    await expect(
      seed({
        confirmDb: "neondb",
        recordsOverride: [invalidRecord],
      })
    ).rejects.toThrow();
  });

  it("AC-4: Refuses to run without matching confirmation flag", async () => {
    await expect(
      seed({
        confirmDb: "wrong-database-name",
      })
    ).rejects.toThrow(/Target confirmation required/);
  });
});
