import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskModal } from "./TaskModal";

const mockTranslations: Record<string, string> = {
    newTask: "New Task",
    editTask: "Edit Task",
    createTask: "Create Task",
    title: "Title",
    description: "Description",
    dueDate: "Due Date",
    status: "Status",
    priority: "Priority",
    taskPlaceholder: "What needs to be done?",
    descriptionPlaceholder: "Add some details...",
    inProgress: "In Progress",
    completed: "Completed",
    low: "Low",
    medium: "Medium",
    high: "High",
    cancel: "Cancel",
    saving: "Saving...",
    creating: "Creating...",
    saveChanges: "Save Changes",
};

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => mockTranslations[key] || key,
    }),
}));

const defaultProps = {
    isModalOpen: true,
    editingTaskId: null,
    newTask: {
        title: "",
        description: "",
        dueDate: "",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
    },
    setNewTask: vi.fn(),
    errors: {
        title: "",
        description: "",
    },
    isSaving: false,
    today: "2026-08-05",
    onClose: vi.fn(),
    onSave: vi.fn(),
};

describe("TaskModal", () => {
    it("renders create task title", () => {
        render(<TaskModal {...defaultProps} />);
        expect(
            screen.getByRole("heading", { name: /create task/i })
        ).toBeInTheDocument();
    });

    it("renders title input", () => {
        render(<TaskModal {...defaultProps} />);
        expect(screen.getByPlaceholderText("What needs to be done?")).toBeInTheDocument();
    });

    it("renders description textarea", () => {
        render(<TaskModal {...defaultProps} />);
        expect(screen.getByPlaceholderText("Add some details...")).toBeInTheDocument();
    });

    it("calls onClose when Cancel button is clicked", async () => {
        const user = userEvent.setup();

        const onClose = vi.fn();

        render(
            <TaskModal
                {...defaultProps}
                onClose={onClose}
            />
        );

        await user.click(screen.getByText("Cancel"));

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});