---
description: 在进行任何创造性工作之前必须使用——创建功能、构建组件、添加功能或修改行为。在实现之前探索需求和设计。
disable-model-invocation: true
---

使用 Task 工具派遣 brainstormer 子代理来执行头脑风暴：

```
Task 工具 (subagent_type="brainstormer"):
  description: "头脑风暴：[用户描述的功能/想法]"
  prompt: |
    请对以下需求进行头脑风暴和设计探索：

    ## 用户需求
    [将用户的原始需求完整粘贴在这里]

    ## 项目上下文
    这是 ai-auto-chess 项目，一个基于 Vue3 + Phaser + Hono.js + Bun 的自走棋游戏。
    架构分三包：shared（类型/工具）、server（API/WebSocket）、web（前端/游戏引擎）。

    请调用 superpowers:brainstorming 技能，完整执行头脑风暴流程，
    包括探索项目上下文、提出 2-3 种方案、获得用户批准、编写设计文档，
    最后调用 superpowers:writing-plans 创建实现计划。
```

**注意：** 不要自己执行头脑风暴，必须通过 Task 工具派遣 brainstormer 子代理，
这样才能使用 Kimi K2.5 模型进行头脑风暴。
