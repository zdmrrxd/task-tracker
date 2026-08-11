import { test, expect } from '@playwright/test';

test('user can search tasks', async ({ page }) => {
    const taskName = `Search-${Date.now()}`;

    await page.goto('/');

    // Görev oluştur
    await page.getByRole('button', { name: /New Task/i }).click();

    await page.locator('#task-title').fill(taskName);
    await page.locator('#task-description').fill('Search test');
    await page.locator('#task-due-date').fill('2026-12-31');
    await page.locator('#task-status').selectOption('IN_PROGRESS');
    await page.locator('#task-priority').selectOption('HIGH');

    await page.getByRole('button', {
        name: /Create Task/i,
    }).click();

    await expect(page.locator('#task-title')).toHaveCount(0);

    // Ara
    await page
        .getByPlaceholder(/Search your tasks|Görevlerinde ara/i)
        .fill(taskName);

    await expect(page.getByText(taskName)).toBeVisible();
});