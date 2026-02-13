import { expect, test } from '@playwright/test'

test('user can manage favorites list after favoriting from feed', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('favorite-toggle').first().click()
  await page.getByRole('link', { name: 'Favorites' }).click()

  await expect(page.getByTestId('favorites-title')).toBeVisible()
  await page.getByTestId('favorites-clear-all').click()
  await expect(page.getByText('还没有收藏')).toBeVisible()
})
