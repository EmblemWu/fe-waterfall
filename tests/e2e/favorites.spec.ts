import { expect, test } from '@playwright/test'

test('direct detail url renders standalone full page', async ({ page }) => {
  await page.goto('/explore/item-24')
  await expect(page.getByTestId('detail-page')).toBeVisible()
  await expect(page.getByTestId('detail-overlay')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
