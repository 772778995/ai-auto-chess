---
name: finishing-a-development-branch
description: 使用当实现完成、所有测试通过且需要决定如何整合工作时，需要呈现合并、PR 或清理的结构化选项
---

# 完成开发分支

## 概述

通过呈现清晰选项和处理选择的工作流来指导开发工作的完成。

**核心原则：** 验证测试 → 呈现选项 → 执行选择 → 清理。

**开始时宣布：** "我正在使用 finishing-a-development-branch 技能来完成这项工作。"

## 流程

### 步骤 1：验证测试

**在呈现选项之前，验证测试通过：**

```bash
# 运行项目的测试套件
npm test / cargo test / pytest / go test ./...
```

**如果测试失败：**
```
测试失败（<N> 个失败）。必须在完成前修复：

[显示失败]

在测试通过之前无法继续合并/PR。
```

停止。不要继续到步骤 2。

**如果测试通过：** 继续到步骤 2。

### 步骤 2：确定基础分支

```bash
# 尝试常见的基础分支
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

或者询问："这个分支从 main 分离——正确吗？"

### 步骤 3：呈现选项

精确呈现这 4 个选项：

```
实现完成。你想做什么？

1. 本地合并回 <base-branch>
2. 推送并创建 Pull Request
3. 保持分支原样（我稍后处理）
4. 丢弃这项工作

选择哪个选项？
```

**不要添加解释** - 保持选项简洁。

### 步骤 4：执行选择

#### 选项 1：本地合并

```bash
# 切换到基础分支
git checkout <base-branch>

# 拉取最新
git pull

# 合并功能分支
git merge <feature-branch>

# 在合并结果上验证测试
<test command>

# 如果测试通过
git branch -d <feature-branch>
```

然后：清理工作树（步骤 5）

#### 选项 2：推送并创建 PR

```bash
# 推送分支
git push -u origin <feature-branch>

# 创建 PR
gh pr create --title "<title>" --body "$(cat <<'EOF'
## 摘要
<2-3 点更改内容>

## 测试计划
- [ ] <验证步骤>
EOF
)"
```

然后：清理工作树（步骤 5）

#### 选项 3：保持原样

报告："保持分支 <name>。工作树保留在 <path>。"

**设计文档和实现计划保留在 `docs/design/` 和 `docs/roadmap/` 中，不清理。**

**不要清理工作树。**

**注意：** roadmap 状态保持 🔄 进行中，直到用户稍后处理。

#### 选项 4：丢弃

**先确认：**
```
这将永久删除：
- 分支 <name>
- 所有提交：<commit-list>
- <path> 处的工作树

输入 'discard' 确认。
```

等待精确确认。

如果确认：
```bash
git checkout <base-branch>
git branch -D <feature-branch>
```

然后：清理工作树（步骤 5）

### 步骤 5：清理工作树

**对于选项 1、2、4：**

检查是否在工作树中：
```bash
git worktree list | grep $(git branch --show-current)
```

如果是：
```bash
git worktree remove <worktree-path>
```

**对于选项 3：** 保留工作树。

### 步骤 6：清理工作树

**对于选项 1、2、4：**

检查是否在工作树中：
```bash
git worktree list | grep $(git branch --show-current)
```

如果是：
```bash
git worktree remove <worktree-path>
```

**对于选项 3：** 保留工作树。

---

**路线图状态已在 executing-plans 技能步骤 6 中更新。**

状态符号：
- ⬜ 待开始
- 🔄 进行中
- ✅ 已完成
- ❌ 已阻塞

这形成工作流闭环：
```
roadmap (待办) → brainstorming → writing-plans → executing-plans
                                                       ↓
roadmap (完成) ← finishing-a-development-branch ←─────┘
```

## 快速参考

| 选项 | 合并 | 推送 | 保留工作树 | 清理分支 |
|--------|-------|------|---------------|----------------|
| 1. 本地合并 | ✓ | - | - | ✓ |
| 2. 创建 PR | - | ✓ | ✓ | - |
| 3. 保持原样 | - | - | ✓ | - |
| 4. 丢弃 | - | - | - | ✓ (强制) |

## 常见错误

**跳过测试验证**
- **问题：** 合并损坏代码，创建失败 PR
- **修复：** 在提供选项前始终验证测试

**开放式问题**
- **问题：** "接下来我应该做什么？" → 模糊
- **修复：** 精确呈现 4 个结构化选项

**自动工作树清理**
- **问题：** 当可能需要时删除工作树（选项 2、3）
- **修复：** 只为选项 1 和 4 清理

**丢弃前没有确认**
- **问题：** 意外删除工作
- **修复：** 需要输入 "discard" 确认

## 危险信号

**永远不要：**
- 继续使用失败的测试
- 在未验证结果上的测试的情况下合并
- 在没有确认的情况下删除工作
- 在没有明确请求的情况下强制推送

**始终：**
- 在提供选项前验证测试
- 精确呈现 4 个选项
- 为选项 4 获取输入确认
- 只为选项 1 和 4 清理工作树

## 整合

**被以下调用：**
- **subagent-driven-development**（最后一步）- 所有任务完成后
- **executing-plans**（步骤 7）- 所有批次完成后

**配对使用：**
- **using-git-worktrees** - 清理该技能创建的工作树