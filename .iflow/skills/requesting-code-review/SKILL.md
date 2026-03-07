---
name: requesting-code-review
description: 使用当完成任务、实现主要功能或合并前需要验证工作是否符合要求时
---

# 请求代码审查

派遣 superpowers:code-reviewer 子代理在问题级联之前捕获它们。

**核心原则：** 尽早审查，经常审查。

## 何时请求审查

**强制：**
- 在 subagent-driven development 中的每个任务之后
- 完成主要功能后
- 合并到 main 之前

**可选但有价值：**
- 当卡住时（新鲜视角）
- 重构前（基线检查）
- 修复复杂 bug 后

## 如何请求

**1. 获取 git SHA：**
```bash
BASE_SHA=$(git rev-parse HEAD~1)  # 或 origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

**2. 派遣 code-reviewer 子代理：**

使用 Task 工具和 superpowers:code-reviewer 类型，填写 `code-reviewer.md` 的模板

**占位符：**
- `{WHAT_WAS_IMPLEMENTED}` - 你刚刚构建的内容
- `{PLAN_OR_REQUIREMENTS}` - 它应该做什么
- `{BASE_SHA}` - 起始提交
- `{HEAD_SHA}` - 结束提交
- `{DESCRIPTION}` - 简要摘要

**3. 根据反馈行动：**
- 立即修复关键问题
- 在继续前修复重要问题
- 记录次要问题以便稍后处理
- 如果审查者错了则反驳（附理由）

## 示例

```
[刚刚完成任务 2：添加验证功能]

你：让我在继续之前请求代码审查。

BASE_SHA=$(git log --oneline | grep "任务 1" | head -1 | awk '{print $1}')
HEAD_SHA=$(git rev-parse HEAD)

[派遣 superpowers:code-reviewer 子代理]
  WHAT_WAS_IMPLEMENTED: 对话索引的验证和修复功能
  PLAN_OR_REQUIREMENTS: docs/roadmap/deployment-plan.md 中的任务 2
  BASE_SHA: a7981ec
  HEAD_SHA: 3df7661
  DESCRIPTION: 添加了 verifyIndex() 和 repairIndex()，有 4 种问题类型

[子代理返回]：
  优点：架构清晰，真实测试
  问题：
    重要：缺少进度指示器
    次要：报告间隔的魔术数字 (100)
  评估：准备继续

你：[修复进度指示器]
[继续任务 3]
```

## 与工作流集成

**Subagent-Driven Development：**
- 每个任务后审查
- 在问题累积之前捕获
- 在进入下一个任务前修复

**Executing Plans：**
- 每个批次后审查（3 个任务）
- 获取反馈，应用，继续

**Ad-Hoc Development：**
- 合并前审查
- 卡住时审查

## 危险信号

**永远不要：**
- 因为"很简单"而跳过审查
- 忽略关键问题
- 继续处理未修复的重要问题
- 与有效的技术反馈争论

**如果审查者错了：**
- 用技术推理反驳
- 展示证明它有效的代码/测试
- 请求澄清

查看模板：requesting-code-review/code-reviewer.md