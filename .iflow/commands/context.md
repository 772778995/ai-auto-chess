---
description: 快速获取当前项目状态——当前分支、未完成任务、最近提交、未提交更改。用于恢复中断的会话，或在新会话开始时建立上下文。
disable-model-invocation: true
---

执行以下命令收集项目状态，然后整理成简洁摘要输出给用户：

```bash
# 当前 git 状态
echo "=== 当前分支 ==="
git branch --show-current

echo "=== Worktree 状态 ==="
git worktree list

echo "=== 最近 10 条提交 ==="
git log --oneline -10

echo "=== 未提交更改 ==="
git status --short

echo "=== Roadmap 状态 ==="
cat docs/roadmap/README.md 2>/dev/null || echo "[无 roadmap]"
```

**输出格式：**

整理成以下结构汇报：

```
## 当前上下文

**分支：** [当前分支名]
**Worktree：** [活跃的 worktree 列表，或"无"]

**未完成任务（来自 roadmap）：**
- 🔄 [进行中的任务]
- ⬜ [待开始的下一个任务]

**最近提交：**
[最近 3-5 条 commit，格式：hash 简短描述]

**未提交更改：**
[文件列表，或"工作区干净"]

**建议下一步：**
[根据以上状态给出 1 句话建议，例如：
 - "继续执行进行中的任务 X"
 - "当前工作区干净，可以开始下一个任务 Y"
 - "有未提交更改，建议先提交或确认是否丢弃"]
```
