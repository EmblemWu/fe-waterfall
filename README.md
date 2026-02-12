# Fe-Waterfall

高交互内容流产品（瀑布流）+ 窗口化虚拟渲染示例项目。

## 项目定位

- 面向普通用户的内容流/素材浏览产品。
- 支持搜索、筛选、收藏、详情查看。
- 核心亮点：超大数据量（12,000 mock）下依旧保持流畅滚动。

## Tech Stack

- React 19 + TypeScript (strict)
- Vite + pnpm
- CSS Modules
- TanStack Query
- Vitest + Playwright
- GitHub Actions CI
- GitHub Pages Deployment

## 功能清单

- Feed:
  - 分页 + 无限滚动
  - 搜索 + 分类筛选
  - 收藏/取消收藏（localStorage）
  - 图片懒加载 + 骨架屏
  - 空态/错误态/加载态
- 虚拟化（核心）:
  - Windowed Rendering + overscan
  - Masonry 布局
  - 动态高度测量（ResizeObserver）
  - 高度缓存 + 滚动位置恢复
- Detail:
  - 详情查看
  - Esc 关闭返回
- Favorites:
  - 收藏列表展示与管理

## 架构说明

```text
src/
  app/            # 路由、providers、layout、全局错误边界
  pages/          # Feed / Detail / Favorites
  features/
    feed/         # api、masonry布局、虚拟化、工具栏、卡片
    detail/       # 详情页数据hook
    favorites/    # 收藏状态与context
  ui/             # 轻量组件
  lib/            # mock、request、perf、storage、logger
  types/
```

## 性能结果（摘要）

- Week2（无虚拟化）: 深滚动后 DOM 卡片节点可达 600+。
- Week3（虚拟化1.0）: 常见场景仅渲染 50~130 节点。
- Week4（虚拟化2.0）: 动态测量 + 高度缓存后，滚动跳动明显减少。
- 详细记录见 `docs/PERF_LOG.md`。

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

## 部署（GitHub Pages）

1. 推送到 GitHub 仓库（默认分支 `main`）。
2. 在仓库 `Settings -> Pages` 中将 source 设置为 `GitHub Actions`。
3. `Deploy Pages` workflow 会在 push `main` 后自动部署。
4. Demo URL 形如：`https://<your-github-name>.github.io/fe-waterfall/`

## 已知限制与后续

- 大量图片同时完成加载时仍可能触发短时 relayout。
- 目前搜索/筛选在主线程进行，后续可加 Web Worker 版本。
- Masonry 布局计算为全量重算，可继续优化为增量布局。
