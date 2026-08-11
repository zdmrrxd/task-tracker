import { test, expect } from '@playwright/test';

test('user can delete a task', async ({ page }) => {
    await page.goto('/');

    // Tarayıcıdaki confirm penceresini otomatik onayla
    page.on('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm');
        await dialog.accept();
    });

    // İlk Delete butonuna tıkla
    await page.getByRole('button', { name: /Delete|Sil/i }).first().click();

    // Silme tamamlanana kadar bekle
    await expect(
        page.getByRole('button', { name: /Deleting|Siliniyor/i }).first()
    ).toBeHidden({ timeout: 10000 });
});