# Fe-Waterfall Community Web

基于现有瀑布流项目迭代出的“内容社区 Web”版本，目标是可运行、可验证、可部署的产品闭环，而不是 UI demo。

## 1. 产品定位

- 形态：类小红书的信息流社区
- 核心体验：推荐/关注双 feed + 搜索发现 + 详情互动 + 个人沉淀
- 重点能力：大数据瀑布流虚拟化、互动 optimistic 回滚、评论可恢复

## 2. 功能闭环

### 首页 `/`

- 推荐 / 关注两个 feed tab
- 两个 tab 都是瀑布流 + 虚拟化
- tab 切换保留独立滚动位置
- 支持点赞/收藏/关注（登录后可用）

### 搜索页 `/search`

- 关键词搜索
- 标签筛选
- 输入防抖
- 搜索历史 localStorage

### 详情页 `/detail/:id`

- 图文轮播
- 评论列表分页加载
- 发表评论（optimistic + 失败重试）

### 个人页 `/profile`

- 我的收藏
- 浏览历史（最近 50 条）
- 关注列表

### 稳定性

- Global ErrorBoundary
- 路由级 errorElement + 404
- 图片加载失败占位
- 各模块均有加载态/空态/错误态/重试

## 3. 互动机制

- 登录后可用：点赞/收藏/关注
- optimistic update：先更新 UI，再请求
- 模拟 10% 失败：失败后自动回滚并提示

## 4. 技术栈

- React 19 + TypeScript (strict)
- Vite + pnpm
- CSS Modules
- TanStack Query
- Vitest + Playwright
- GitHub Actions CI + GitHub Pages

## 5. 工程结构

```text
src/
  app/             # 路由、layout、providers、全局异常
  pages/           # Feed/Search/Detail/Profile/404
  features/
    auth/          # 登录态
    feed/          # 信息流、虚拟化、瀑布流
    detail/        # 评论与详情数据
    social/        # 点赞/收藏/关注与历史
  ui/              # 轻量组件
  lib/             # request/mock/storage/perf
  types/           # 类型定义
```

## 6. 性能结果

详见 `docs/PERF_LOG.md`：包含 baseline + 至少 2 次优化对比 + 复现步骤。

## 7. 质量与验证

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
```

关键 e2e 路径：

- 首页滚动 -> 搜索 -> 详情 -> 收藏 -> 个人页验证

## 8. 部署

- Demo: `https://emblemwu.github.io/fe-waterfall/`
- CI: `.github/workflows/ci.yml`
- Deploy: `.github/workflows/deploy-pages.yml`

## 9. 已知限制

- 搜索/筛选仍在主线程执行，Worker 版暂未落地（已列为后续项）。
- 瀑布流布局仍是全量重排策略，后续可做增量布局优化。
