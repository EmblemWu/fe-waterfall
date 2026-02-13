import { expect, test } from '@playwright/test'

test('user can manage favorites in profile page', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('auth-toggle').click()

  await page.getByTestId('favorite-toggle').first().click()
  await page.getByRole('link', { name: '个人页' }).click()

  await expect(page.getByTestId('profile-page')).toBeVisible()
  await page.getByRole('button', { name: '清空收藏' }).click()
  await expect(page.getByText('暂无收藏')).toBeVisible()
})
