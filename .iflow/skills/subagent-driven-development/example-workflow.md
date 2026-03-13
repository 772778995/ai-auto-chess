# 示例工作流

本文件展示 subagent-driven-development 的完整执行过程。

## 场景：执行包含 2 个任务的计划

```
控制器：我正在使用 Subagent-Driven Development 来执行这个计划。

[设置 worktree]
[一次性阅读计划文件：docs/plans/2026-03-10-01-战斗系统-plan.md]
[提取所有 2 个任务的全文和上下文]
[创建 TodoWrite，包含所有任务]

---

任务 1：添加拼点逻辑

[派遣 implementer 子代理，提供完整任务文本 + 项目上下文]

implementer："在开始之前——拼点失败时先攻权如何处理？设计文档里没有说。"

控制器："平局时后手方获得先攻权，参见 docs/design/2026-02-24-战斗系统-design.md 第 3 节。"

implementer："明白了。"
[稍后] implementer：
  - 实现了 CoinFlipSystem，TDD，5/5 测试通过
  - 自我审查：发现未处理平局边界情况，已修复
  - 已提交：feat(battle): add coin flip priority system

[派遣 spec-reviewer]
规范审查者：❌ 问题：
  - 缺少：拼点结果事件广播（规范要求通知客户端）
  - 多余：添加了 coinFlipHistory 记录（未请求）

[派遣 implementer 修复]
implementer：删除 history 记录，添加 CoinFlipResultEvent 广播

[spec-reviewer 重新审查]
规范审查者：✅ 规范合规

[派遣 code-quality-reviewer]
审查者：优点：事件驱动设计清晰，测试覆盖完整。
  问题（次要）：PRIORITY_HOLDER 魔术字符串未提取为常量。

[implementer 修复]
implementer：提取为 CoinFlipResult enum

[code-quality-reviewer 重新审查]
审查者：✅ 已批准

[标记任务 1 完成]

---

任务 2：集成拼点到战斗流程

[派遣 implementer，提供完整任务文本 + 上下文（含任务 1 的实现摘要）]

implementer：[无问题，直接开始]
[稍后] implementer：
  - 在 BattleSystem.startBattle() 中集成拼点
  - 修改了 WebSocket 消息顺序
  - 8/8 测试通过，已提交

[派遣 spec-reviewer]
规范审查者：✅ 规范合规

[派遣 code-quality-reviewer]
审查者：✅ 已批准，架构集成干净

[标记任务 2 完成]

---

[所有任务完成]
[派遣最终 code-reviewer，提供 BASE_SHA 和 HEAD_SHA]
最终审查者：所有需求满足，无残留问题，准备合并。

[调用 finishing-a-development-branch]
```

## 关键观察

- **控制器只做调度**，不写任何代码
- **每个任务新鲜子代理**，无上下文污染
- **规范审查先于质量审查**，顺序不能颠倒
- **子代理提问时先回答**，不要催促直接实现
- **审查发现问题 = 当前任务未完成**，必须修复后重新审查才能进入下一任务
