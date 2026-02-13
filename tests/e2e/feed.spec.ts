import { expect, test } from '@playwright/test'

test('home -> search -> detail -> favorite -> profile verify', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '内容社区首页' })).toBeVisible()

  await page.getByTestId('auth-toggle').click()
  await page.mouse.wheel(0, 2000)

  await page.getByRole('link', { name: '搜索' }).click()
  await page.getByTestId('search-page-input').fill('Aurora')
  await page.getByRole('link', { name: '查看详情' }).first().click()
  await expect(page.getByTestId('detail-page')).toBeVisible()

  await page
    .getByRole('button', { name: /收藏|取消收藏/ })
    .first()
    .click()

  await page.goto('/profile')
  await expect(page.getByRole('heading', { name: '个人页' })).toBeVisible()
  await expect(page.getByText('我的收藏')).toBeVisible()
})
