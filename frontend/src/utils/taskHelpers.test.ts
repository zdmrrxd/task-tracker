import { describe, expect, it } from "vitest";
import { normalizeStatus, formatDueDate, getGreeting } from "./taskHelpers";

describe("normalizeStatus", () => {
    it("should convert DONE to COMPLETED", () => {
        expect(normalizeStatus("DONE")).toBe("COMPLETED");
    });

    it("should convert IN PROGRESS to IN_PROGRESS", () => {
        expect(normalizeStatus("IN PROGRESS")).toBe("IN_PROGRESS");
    });

    it("should leave unknown status unchanged", () => {
        expect(normalizeStatus("WAITING")).toBe("WAITING");
    });
});

describe("formatDueDate", () => {
    it("should return 'No due date' when date is null", () => {
        expect(formatDueDate(null)).toBe("No due date");
    });

    it("should format date correctly", () => {
        expect(formatDueDate("2026-08-05")).toBe("05 Aug 2026");
    });
});

describe("getGreeting", () => {
    it("should return translation if provided", () => {
        const t = {
            goodMorning: "Günaydın",
            goodAfternoon: "İyi günler",
            goodEvening: "İyi akşamlar",
        };

        const greeting = getGreeting(t);

        expect([
            "Günaydın",
            "İyi günler",
            "İyi akşamlar",
        ]).toContain(greeting);
    });
});