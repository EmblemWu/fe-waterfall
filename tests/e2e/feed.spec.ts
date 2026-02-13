import { expect, test } from '@playwright/test'

test('home card opens modal and ESC closes with scroll retained', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '内容社区首页' })).toBeVisible()

  await page.mouse.wheel(0, 2600)
  const before = await page.evaluate(() => window.scrollY)

  await page.locator('[data-testid="feed-card"] a').first().click()
  await expect(page.getByTestId('detail-modal')).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByTestId('detail-modal')).toHaveCount(0)

  const after = await page.evaluate(() => window.scrollY)
  expect(after).toBeGreaterThan(before - 240)
})
