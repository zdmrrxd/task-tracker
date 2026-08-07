import { test, expect } from '@playwright/test';

test.describe('Create Task Tests', () => {

    test('user can create a task', async ({ page }) => {
        const taskName = `Playwright-Create-${Date.now()}`;

        await page.goto('/');

        // 1. Modalı aç (data-testid veya esnek text filtresi ile)
        // Eğer data-testid ekleyebiliyorsan: await page.getByTestId('new-task-btn').click();
        await page.getByRole('button').filter({ hasText: /New|Yeni/i }).click();

        // Formu doldur
        await page.locator('#task-title').fill(taskName);
        await page.locator('#task-description').fill('Created by Playwright');
        await page.locator('#task-due-date').fill('2026-12-31');
        await page.locator('#task-status').selectOption('IN_PROGRESS');
        await page.locator('#task-priority').selectOption('HIGH');

        // 2. POST isteğini bekle ve görevi kaydet
        const createPromise = page.waitForResponse(
            res => res.url().includes('/api/tasks') && res.request().method() === 'POST' && res.ok()
        );
        await page.getByRole('button', { name: /Create|Oluştur/i }).click();

        const createResponse = await createPromise;
        // 200 OK veya 201 Created durumlarını kapsamak için ok() doğruluyoruz
        expect(createResponse.ok()).toBeTruthy();

        // 3. Modalın kapandığını doğrula
        await expect(page.locator('#task-title')).toHaveCount(0);

        // 4. Görevi ara ve eklenen kartı scoped (kapsamlı) olarak bul
        await page
            .getByPlaceholder(/Search your tasks|Görevlerinde ara/i)
            .fill(taskName);

        const taskCard = page.locator('article').filter({ hasText: taskName });
        await expect(taskCard).toBeVisible();

        // --- CLEANUP (Temizlik Adımı) ---
        // Backend'deki DELETE endpoint (404 hatası) düzeltildikten sonra bu blok sorunsuz çalışacaktır.
        const deletePromise = page.waitForResponse(
            res => res.url().includes('/api/tasks') && res.request().method() === 'DELETE' && res.ok()
        );

        // Olası bir silme onay dialog'unu otomatik kabul et
        page.once('dialog', dialog => dialog.accept());

        // Yalnızca ilgili taskCard içindeki Delete butonuna tıkla
        await taskCard.getByRole('button', { name: /Delete|Sil/i }).click();
        await deletePromise;

        // Görevin silindiğini teyit et
        await expect(taskCard).toHaveCount(0);
    });

});