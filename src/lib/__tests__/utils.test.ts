import { describe, it, expect } from "vitest";
import { cn, formatPrice, formatDate, slugify } from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "end");
    expect(result).toContain("base");
    expect(result).toContain("end");
    expect(result).not.toContain("hidden");
  });

  it("handles undefined and null", () => {
    const result = cn("base", undefined, null);
    expect(result).toBe("base");
  });

  it("handles empty input", () => {
    const result = cn();
    expect(result).toBe("");
  });
});

describe("formatPrice", () => {
  it("formats integer PKR prices with comma separators", () => {
    expect(formatPrice(65000)).toBe("Rs 65,000");
  });

  it("formats large PKR prices", () => {
    expect(formatPrice(330000)).toBe("Rs 330,000");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("Rs 0");
  });

  it("formats small amounts", () => {
    expect(formatPrice(1500)).toBe("Rs 1,500");
  });

  it("formats with custom currency", () => {
    expect(formatPrice(65000, "$")).toBe("$65,000");
  });

  it("formats with no decimals for whole numbers", () => {
    expect(formatPrice(65000)).not.toContain(".");
  });
});

describe("formatDate", () => {
  it("formats a Date object to readable string", () => {
    const date = new Date("2026-03-15");
    const result = formatDate(date);
    expect(result).toMatch(/Mar/);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2026/);
  });

  it("formats a date string to readable string", () => {
    const result = formatDate("2026-01-01");
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/1/);
    expect(result).toMatch(/2026/);
  });

  it("formats a timestamp to readable string", () => {
    const result = formatDate(new Date("2026-12-25").getTime());
    expect(result).toMatch(/Dec/);
    expect(result).toMatch(/25/);
  });
});

describe("slugify", () => {
  it("converts text to URL-friendly slug", () => {
    expect(slugify("King Foam Bed")).toBe("king-foam-bed");
  });

  it("handles special characters", () => {
    expect(slugify("Bed & Dressing Table!")).toBe("bed-dressing-table");
  });

  it("handles multiple spaces", () => {
    expect(slugify("  King   Foam  Bed  ")).toBe("king-foam-bed");
  });

  it("handles Urdu/Roman text", () => {
    expect(slugify("King Size Bed (Walnut)")).toBe("king-size-bed-walnut");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("lowercases all text", () => {
    expect(slugify("KING FOAM BED")).toBe("king-foam-bed");
  });

  it("removes leading and trailing hyphens", () => {
    expect(slugify("-king-foam-bed-")).toBe("king-foam-bed");
  });
});
