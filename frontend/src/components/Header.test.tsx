import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                myWorkspace: "MY WORKSPACE",
                tasks: "Tasks",
                headerSubtitle: "Everything you need to manage your tasks.",
                searchTasks: "Search your tasks",
                newTask: "New Task",
            };

            return translations[key] || key;
        },
        i18n: {
            language: "en",
            changeLanguage: vi.fn(),
        },
    }),
}));

describe("Header", () => {
    const props = {
        greeting: "Good morning",
        searchTerm: "",
        setSearchTerm: vi.fn(),
        onOpenTaskModal: vi.fn(),
    };

    it("renders greeting", () => {
        render(<Header {...props} />);
        expect(screen.getByText("Good morning")).toBeInTheDocument();
    });

    it("renders search input", () => {
        render(<Header {...props} />);
        expect(
            screen.getByPlaceholderText("Search your tasks")
        ).toBeInTheDocument();
    });

    it("renders new task button", () => {
        render(<Header {...props} />);
        expect(screen.getByText("New Task")).toBeInTheDocument();
    });
});