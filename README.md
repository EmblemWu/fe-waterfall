# Fe-Waterfall

高交互内容流产品（瀑布流）+ 窗口化虚拟渲染项目，目标是展示“真实可部署 + 可验证性能收益”的前端交付能力。

## 项目定位

- 面向普通用户的内容流/素材浏览产品。
- 支持搜索、筛选、收藏、详情查看。
- 核心卖点：在 `12,000` 条 mock 数据场景下保持滚动流畅和可维护工程质量。

## Demo

- 线上地址: `https://emblemwu.github.io/fe-waterfall/`

## 用户路径（可跑通）

- 路径 A（内容消费）:
  - Feed 浏览 -> 搜索/筛选 -> 打开详情 -> 返回继续滚动
- 路径 B（收藏管理）:
  - Feed 收藏 -> Favorites 管理（单条取消/批量清空）-> 回到 Feed

## Tech Stack

- React 19 + TypeScript (strict)
- Vite + pnpm
- CSS Modules
- TanStack Query
- Vitest + Playwright
- GitHub Actions CI + GitHub Pages

## 功能清单

- Feed（主页面）:
  - 分页 + 无限滚动
  - 搜索 + 分类筛选
  - 收藏/取消收藏（localStorage 持久化）
  - 图片懒加载 + 骨架屏 + 资源失败兜底
  - 加载态 / 空态 / 错误态 / 重试
- 虚拟化（核心）:
  - Windowed Rendering + overscan
  - Masonry 布局
  - 动态高度测量（ResizeObserver）
  - 高度缓存 + 滚动位置恢复
- Detail:
  - 详情查看
  - Esc 关闭返回
  - 图片失败 fallback
- Favorites:
  - 收藏列表展示
  - 取消收藏
  - 批量清空当前页收藏
- 路由异常处理:
  - 全局 ErrorBoundary
  - 路由级 `errorElement`
  - 404 页面

## 架构说明

```text
src/
  app/            # router/layout/providers/error boundary
  pages/          # Feed / Detail / Favorites / NotFound / RouteError
  features/
    feed/         # api、masonry布局、虚拟化、工具栏、卡片
    detail/       # 详情页数据 hook
    favorites/    # 收藏状态与 context
  ui/             # Button/Input/Card/Skeleton/EmptyState
  lib/            # mock/request/perf/storage/logger
  types/          # 业务类型定义
```

## 性能结果（证据）

见 `docs/PERF_LOG.md`，包含：

- baseline（无虚拟化）
- 至少 2 次优化对比（虚拟化、动态高度缓存、稳定性优化）
- 固定数据集和复现步骤

## 关键取舍

- 选择 TanStack Query：减少自建缓存/并发管理复杂度。
- 选择 CSS Modules：降低样式冲突成本，兼顾维护效率。
- 虚拟化策略优先稳定性：先保证窗口渲染和滚动恢复，再做更激进的增量布局优化。

## 已知限制

- 图片源依赖外部服务时，网络波动仍会影响首屏观感（已加 fallback）。
- 当前筛选仍在主线程，后续可迁移至 Web Worker。
- Masonry 为全量重算，后续可升级为增量布局计算。

## 本地运行

```bash
pnpm install
pnpm dev
```

## 验收命令

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
```

## CI / 部署

- CI: `.github/workflows/ci.yml`（lint/typecheck/test/build/e2e）
- Deploy: `.github/workflows/deploy-pages.yml`
- Pages: `Settings -> Pages -> Source: GitHub Actions`
