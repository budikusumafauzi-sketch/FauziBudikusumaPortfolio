import { describe, it, expect } from "vitest";
import React from "react";
import { Container, Button, IconButton, Card, Chip, SectionHeader, CornerFrame } from "@/components/ui/primitives";

describe("Shared UI Primitives", () => {
  it("exports all required primitives", () => {
    expect(Container).toBeDefined();
    expect(Button).toBeDefined();
    expect(IconButton).toBeDefined();
    expect(Card).toBeDefined();
    expect(Chip).toBeDefined();
    expect(SectionHeader).toBeDefined();
    expect(CornerFrame).toBeDefined();
  });
});
