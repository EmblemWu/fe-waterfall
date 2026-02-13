# PERF LOG - Waterfall Lab Community

## Baseline

- Dataset: 12,000 mock notes
- Scene:
  1. 首页深滚动 6-8 屏
  2. 打开详情再返回
  3. 持续搜索筛选
- Observation:
  - DOM 节点随滚动快速增长
  - 长列表下滚动和切换有明显抖动

## Optimization #1 - Virtualized Masonry + Overscan

- Strategy: 仅渲染可视区 + overscan buffer
- Result:
  - DOM card 节点由 `600+` 降至常见 `50-140`
  - 深滚动掉帧感明显下降

## Optimization #2 - Dynamic Height Cache + Scroll Restore

- Strategy:
  - ResizeObserver 动态测高
  - 高度缓存减少重复估算
  - 推荐/关注 tab + 搜索页滚动位置恢复
- Result:
  - 列表跳动明显减少
  - 切 tab、关闭详情回列表时位置恢复稳定

## Optimization #3 - Modal Route + Prefetch + Optimistic Recovery

- Strategy:
  - 卡片 hover 预取详情
  - 路由驱动弹层（背景列表保留）
  - 互动 optimistic + 10% 失败回滚
- Result:
  - 详情打开体感更快
  - 异常场景可恢复，不破坏主流程

## Comparison

| Stage    | Strategy                          | Rendered cards | UX                   |
| -------- | --------------------------------- | -------------- | -------------------- |
| Baseline | 非窗口化长列表                    | 600+           | 深滚动卡顿           |
| Opt#1    | Windowed virtualization           | 50-140         | 滚动显著更稳         |
| Opt#2    | Dynamic cache + restore           | 50-140         | 切换/返回不丢位置    |
| Opt#3    | Modal route + optimistic recovery | 50-140         | 详情与互动闭环更顺畅 |

## Repro Steps

1. 首页点击“性能面板”显示调试信息。
2. 在推荐流深滚动，切关注流，再切回推荐。
3. 打开“开启虚拟化”开关对比渲染数量。
4. 点击卡片打开 modal，按 ESC 关闭，观察列表位置。
5. 进入详情执行点赞/收藏/关注与评论发送，观察失败重试/回滚。
