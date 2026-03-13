---
description: 执行已有的实现计划。读取 docs/plans/ 中的计划文件，分批次执行并设置审查检查点。
disable-model-invocation: true
---

调用 executing-plans 技能并完全按照其呈现的内容执行。

**执行前检查：**
1. 确认 docs/plans/ 中存在计划文件
2. 如果 PreImplementation hook 输出 `[WORKTREE-GATE] ❌`，
   先调用 using-git-worktrees 创建隔离工作区
3. 执行过程中，所有代码实现通过 implementer 子代理完成，
   批次审查通过 code-reviewer 子代理完成

**模型分工：**
- 实现代码 → subagent_type="implementer"
- 代码审查 → subagent_type="code-reviewer"
- 规范检查 → subagent_type="spec-reviewer"
