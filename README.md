# Waterfall Lab - Community Web

将原瀑布流 demo 迭代为内容社区 Web（参考信息流交互逻辑），目标是“可部署、可验证、可复现性能证据”的完整项目。

## 产品定位

- 双信息流：推荐 / 关注
- 路由驱动详情：卡片点击打开 modal，支持直达全屏详情
- 社区闭环：互动（赞/藏/关）+ 评论分页与发送 + 个人页沉淀

## 核心功能

### 首页 `/`

- 推荐 / 关注双 Tab
- 瀑布流 + 虚拟化
- 各 Tab 独立保存：滚动位置、筛选条件、分页缓存
- 卡片整体可点击，打开详情弹层（不是按钮跳转）

### 详情 `/explore/:noteId`

- 从 Feed 打开：Modal Overlay + 背景保留
- 直接访问 URL：全屏详情页
- 桌面两栏：左媒体轮播，右信息与评论区独立滚动
- 互动：点赞/收藏/关注（登录后可用）
- optimistic update + 10% 失败回滚
- 评论：分页加载、发送中、失败重试、成功插入

### 搜索 `/search`

- 关键词防抖
- 标签筛选
- 搜索历史（localStorage）
- 结果复用瀑布流组件

### 个人页 `/profile`

- 我的收藏
- 浏览历史（最近 50 条）
- 关注列表

## 工程结构

```text
src/
  app/              # AppRoutes/layout/providers/error boundary
  pages/            # Feed/Search/Detail/Profile/NotFound
  features/
    auth/           # mock 登录态
    feed/           # 信息流、虚拟化、卡片、查询
    detail/         # 详情与评论
    social/         # 互动状态、历史、个人页数据
  lib/              # request/mock/storage/perf/logger
  ui/               # 轻量通用组件
  types/            # 严格类型定义
```

## 性能策略与结果

- 虚拟化窗口渲染 + overscan
- 动态高度测量 + 高度缓存
- 切 tab/返回列表滚动恢复
- 详见：`docs/PERF_LOG.md`（baseline 与优化对比、复现步骤）

## 质量与测试

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
```

Playwright 覆盖：

1. 首页滚动 -> 卡片 modal -> ESC 关闭 -> 位置保留
2. 直接访问 `/explore/:id` -> 全屏详情可用

## 部署

- Demo: `https://emblemwu.github.io/fe-waterfall/`
- CI: `.github/workflows/ci.yml`
- Deploy: `.github/workflows/deploy-pages.yml`

## 已知限制

- 搜索筛选仍在主线程；Worker 版可作为下一步优化。
- 瀑布流布局仍采用全量重排，后续可做增量布局。
