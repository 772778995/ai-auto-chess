---
name: writing-plans
description: 使用当有需要多步任务的功能规格或需求需要在接触代码之前创建详细实现计划时
---

# 编写计划

## 概述

编写全面的实现计划，假设工程师对我们的代码库零上下文且有问题的品味。记录他们需要知道的一切：每个任务要触及哪些文件、代码、测试、他们可能需要检查的文档、如何测试。以小任务形式给他们整个计划。DRY。YAGNI。TDD。频繁提交。

假设他们是熟练的开发者，但几乎不了解我们的工具集或问题域。假设他们不太了解好的测试设计。

**开始时宣布：** "我正在使用 writing-plans 技能来创建实现计划。"

**上下文：** 此技能在主仓库中运行，创建计划文档。不需要 worktree。worktree 在 executing-plans 或 subagent-driven-development 开始执行时创建。

**保存计划到：** `docs/plans/`

**目录检查：** 
- 保存前确保 `docs/plans/` 目录存在，不存在则创建
- 计划文件名格式：`YYYY-MM-DD-<序号>-<任务名>-plan.md`
- 序号从 01 开始递增，表示执行顺序

## 小任务粒度

**每一步是一个行动（2-5 分钟）：**
- "写失败测试" - 步骤
- "运行它以确保失败" - 步骤
- "实现最小代码使测试通过" - 步骤
- "运行测试并确保通过" - 步骤
- "提交" - 步骤

## 计划文档头部

**每个计划必须以此头部开始：**

```markdown
# [功能名称] 实现计划

> **给 AI 助手：** 必需子技能：使用 executing-plans 或 subagent-driven-development 实现此计划。选择取决于执行环境偏好。

**目标：** [一句话描述这构建什么]

**架构：** [2-3 句话关于方法]

**技术栈：** [关键技术/库]

---
```

## 任务结构

````markdown
### 任务 N：[组件名称]

**文件：**
- 创建：`exact/path/to/file.py`
- 修改：`exact/path/to/existing.py:123-145`
- 测试：`tests/exact/path/to/test.py`

**步骤 1：写失败测试**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

**步骤 2：运行测试验证失败**

运行：`pytest tests/path/test.py::test_name -v`
预期：FAIL 并显示 "function not defined"

**步骤 3：写最小实现**

```python
def function(input):
    return expected
```

**步骤 4：运行测试验证通过**

运行：`pytest tests/path/test.py::test_name -v`
预期：PASS

**步骤 5：提交**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: 添加特定功能"
```
````

## 记住
- 始终是精确的文件路径
- 计划中包含完整代码（不是"添加验证"）
- 带预期输出的精确命令
- 使用 `技能名` 格式引用相关技能（如 `@test-driven-development`）
- DRY、YAGNI、TDD、频繁提交

## 执行交接

保存计划后，**默认使用子代理驱动方式执行**：

> **执行方式：子代理驱动（此会话）**
> - **必需子技能：** 使用 `subagent-driven-development`
> - 留在当前会话，每个任务派遣新鲜子代理
> - 两阶段审查（规范审查 + 质量审查）
> - 快速迭代，实时反馈

**仅在用户明确要求时，才使用批量执行方式：**
> - **必需子技能：** 使用 `executing-plans`
> - 批量执行任务，批次间代码审查
> - 适合较大任务或无人值守执行

## 结束声明

宣布："计划完成。已保存到 `docs/plans/`。默认使用子代理驱动方式执行。"