---
description: 创建详细的实现计划，包含小型任务。在头脑风暴完成、设计文档已存在后使用。
disable-model-invocation: true
---

使用 Task 工具派遣 planner 子代理来创建实现计划：

```
Task 工具 (subagent_type="planner"):
  description: "编写实现计划：[功能名称]"
  prompt: |
    请为以下功能创建详细的实现计划：

    ## 设计文档
    [将 docs/design/ 中对应的设计文档内容完整粘贴在这里]

    ## 项目上下文
    技术栈：Bun + TypeScript + Vue3 + Phaser + Hono.js + Drizzle ORM
    + PostgreSQL + WebSocket + msgpackr + jsondiffpatch
    测试命令：bun test
    构建命令：bun run build（注意 packages/shared 需先构建）

    请调用 superpowers:writing-plans 技能，将设计拆解为精确的 TDD 任务序列，
    保存到 docs/plans/ 目录，并提供执行方式选择。
```

**注意：** 不要自己编写计划，必须通过 Task 工具派遣 planner 子代理，
这样才能使用 GLM-5 模型进行计划编写。
