import { expect, test } from '@playwright/test'

test('user can browse feed, search, open detail and favorite', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '高性能瀑布流' })).toBeVisible()

  await page.mouse.wheel(0, 2000)
  await page.getByTestId('search-input').fill('Aurora')

  await page.getByRole('link', { name: '查看详情' }).first().click()
  await expect(page.getByTestId('detail-page')).toBeVisible()

  await page
    .getByRole('button', { name: /收藏|取消收藏/ })
    .last()
    .click()
})
