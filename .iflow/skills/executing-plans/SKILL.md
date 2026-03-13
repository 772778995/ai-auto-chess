---
name: executing-plans
description: 使用当有书面实现计划需要在单独会话中执行并设置审查检查点时
---

# 执行计划

## 概述

加载计划，批判性审查，分批执行任务，在批次之间进行代码审查。

**核心原则：** 批量执行并设置架构师审查检查点。

**开始时宣布：** "我正在使用 executing-plans 技能来实现此计划。"

## 流程

### 步骤 0：设置隔离工作区

**必需子技能：** 使用 superpowers:using-git-worktrees

在新 worktree 中继续后续步骤。**永远不要在没有明确用户同意的情况下在 main/master 分支上开始实现。**

### 步骤 1：加载和审查计划

1. 阅读计划文件
2. 批判性审查——识别任何问题或疑虑
3. 如果有疑虑：在开始之前向用户提出
4. 如果没有疑虑：创建 TodoWrite 并继续

### 步骤 2：执行批次

**默认：前 3 个任务**

对于每个任务：
1. 标记为 in_progress
2. 完全遵循每一步（计划有小步骤）
3. 按指定运行验证
4. 标记为已完成

### 步骤 3：报告

当批次完成时：
- 显示已实现的内容
- 显示验证输出
- 说："准备接收反馈。"

### 步骤 4：代码审查

**每个批次完成后，派遣 code-reviewer 子代理：**

首先确定批次的 git 范围：

```bash
# 在批次开始前记录
BASE_SHA=$(git rev-parse HEAD)

# 批次结束后获取
HEAD_SHA=$(git rev-parse HEAD)
```

然后通过 Task 工具派遣 code-reviewer 子代理（`subagent_type="code-reviewer"`），在 prompt 中提供：

```
WHAT_WAS_IMPLEMENTED: [本批次完成的任务摘要]
PLAN_OR_REQUIREMENTS: [计划文件路径，如 docs/plans/2026-03-10-01-战斗系统-plan.md]
WORKTREE_PATH: [worktree 根目录路径]
BASE_SHA: [批次起始提交]
HEAD_SHA: [当前提交]
DESCRIPTION: [本批次实现内容的简要描述]
```

**根据审查结果行动：**
- 关键问题：立即修复
- 重要问题：修复后继续
- 次要问题：记录后继续

### 步骤 5：继续

根据反馈和审查结果：
- 应用必要更改
- 执行下一批次
- 重复直到完成

### 步骤 6：完成开发

所有任务完成并验证后：

**必需子技能：** 使用 superpowers:finishing-a-development-branch

## 何时停止并寻求帮助

**立即停止执行当：**
- 批次中途遇到阻碍（缺少依赖、测试失败、指令不清楚）
- 计划有关键空白导致无法开始
- 验证反复失败

**寻求澄清而不是猜测。**

## 错误恢复

遇到阻碍时，记录进度并提供恢复选项：

**记录进度到** `docs/roadmap/<plan-name>-progress.md`：

```markdown
## 当前状态
- 已完成任务：[列表]
- 当前任务：N - [任务名]
- 阻碍原因：[具体描述]
- 已实现文件：[列表]
- 下一步：[恢复时需要做的事情]
```

**呈现恢复选项：**

```
遇到阻碍：[原因]

1. 继续尝试 — 获取更多信息后继续
2. 跳过此任务 — 标记为阻塞，继续下一个
3. 回滚更改 — 撤销当前任务的更改
4. 停止执行 — 保留进度，等待外部解决
```

## 记住

- 首先批判性审查计划
- 完全遵循计划步骤，不跳过验证
- 批次之间：报告 → code-reviewer 审查 → 继续
- 遇到阻碍时停止，不要猜测

## 整合

**必需技能：**
- **superpowers:using-git-worktrees** — 步骤 0 设置隔离工作区
- **superpowers:finishing-a-development-branch** — 步骤 6 完成开发

**审查机制：**
- 步骤 4 直接派遣 code-reviewer 子代理（`subagent_type="code-reviewer"`）
