import { test, expect } from '@playwright/test';

test('user can edit a task', async ({ page }) => {
    const taskName = `Task-${Date.now()}`;
    const newTitle = `Edited-${Date.now()}`;

    await page.goto('/');

    // Önce görev oluştur
    await page.getByRole('button', { name: /New Task/i }).click();

    await page.locator('#task-title').fill(taskName);
    await page.locator('#task-description').fill('Edit test');
    await page.locator('#task-due-date').fill('2026-12-31');
    await page.locator('#task-status').selectOption('IN_PROGRESS');
    await page.locator('#task-priority').selectOption('HIGH');

    await page.getByRole('button', {
        name: /Create Task/i,
    }).click();

    await expect(page.locator('#task-title')).toHaveCount(0);

    // Oluşturduğumuz görevi bul
    await page.getByPlaceholder(/Search your tasks|Görevlerinde ara/i)
        .fill(taskName);

    // Düzenle
    await page.getByRole('button', {
        name: /Edit|Düzenle/i,
    }).first().click();

    await page.locator('#task-title').fill(newTitle);

    const responsePromise = page.waitForResponse(
        response =>
            response.url().includes('/api/tasks') &&
            response.request().method() === 'PUT' &&
            response.ok()
    );

    await page.getByRole('button', {
        name: /Save Changes|Kaydet|Güncelle/i,
    }).click();

    await responsePromise;

    // Yeni başlığı ara
    await page.getByPlaceholder(/Search your tasks|Görevlerinde ara/i)
        .fill(newTitle);

    await expect(page.getByText(newTitle)).toBeVisible();
});