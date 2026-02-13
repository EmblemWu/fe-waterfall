# PERF LOG - Community Feed

## Baseline (Before Upgrade)

- Build: early waterfall demo (single feed)
- Dataset: 12,000 mock items
- Scenario:
  1. 首页持续滚动 6-8 屏
  2. 切筛选和搜索
  3. 打开详情再返回
- Observation:
  - DOM 卡片节点在长滚动后持续增长
  - 图片加载集中完成时，布局抖动可感知

## Optimization #1 - Windowed Virtualization + Overscan

- Change:
  - 首页推荐/关注信息流统一接入虚拟化渲染
  - overscan buffer 保证边缘不卡顿
- Result:
  - 渲染节点从 `600+` 降到典型 `50-140`
  - 长滚动时掉帧体感明显下降

## Optimization #2 - Dynamic Measurement + Height Cache + Scroll Restore

- Change:
  - ResizeObserver 动态测量卡片高度
  - height cache 减少重复估算偏差
  - 推荐/关注 tab 以及搜索页的滚动位置恢复
- Result:
  - 回流跳动减少
  - 切换 tab/回到列表后位置可恢复，减少重复浏览成本

## Optimization #3 - Data/Interaction Stability

- Change:
  - 互动（点赞/收藏/关注） optimistic update + 失败回滚（10% 失败模拟）
  - 评论发布 optimistic + 失败重试
  - 全链路空态/错态/重试
- Result:
  - 网络异常和互动失败场景具备可恢复路径
  - 产品体验从“展示型”变为“可操作闭环型”

## Quick Comparison

| Stage    | Key Strategy                     | Rendered Cards | UX Result      |
| -------- | -------------------------------- | -------------- | -------------- |
| Baseline | No tab-level product flow        | 600+           | 深滚动变慢     |
| Opt#1    | Virtualized masonry              | 50-140         | 滚动稳定       |
| Opt#2    | Dynamic height + cache + restore | 50-140         | 切换返回更稳   |
| Opt#3    | Optimistic + rollback + retry    | 50-140         | 异常场景可恢复 |

## Repro Steps

1. 首页登录后在“推荐”滚动 6 屏并关注作者。
2. 切换“关注”tab，确认有内容并继续滚动。
3. 进入搜索页，输入 `Aurora`，筛 tag，打开详情。
4. 在详情点赞/收藏/评论；失败时点重试。
5. 进入个人页验证“我的收藏/浏览历史/关注列表”。
