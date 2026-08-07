import { test, expect } from '@playwright/test';

test('language switch works', async ({ page }) => {
    await page.goto('/');

    // Varsayılan dil İngilizce
    await expect(
        page.getByRole('button', { name: 'New Task' })
    ).toBeVisible();

    // Türkçeye geç
    await page.getByRole('button', { name: 'Türkçe' }).click();

    await expect(
        page.getByRole('button', { name: 'Yeni Görev' })
    ).toBeVisible();

    // Tekrar İngilizce
    await page.getByRole('button', { name: 'English' }).click();

    await expect(
        page.getByRole('button', { name: 'New Task' })
    ).toBeVisible();
});