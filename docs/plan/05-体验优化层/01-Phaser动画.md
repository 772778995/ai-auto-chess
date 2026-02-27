# 05.1 Phaser 动画

## 目标

实现随从攻击、伤害数字、拼点骰子、词条特效动画。

## 动画列表

| 动画 | 描述 | 优先级 |
|------|------|--------|
| 攻击 | 随从向目标移动并攻击 | P0 |
| 受击 | 随从被击中抖动 | P0 |
| 死亡 | 随从消失动画 | P0 |
| 伤害数字 | 飘字显示伤害值 | P0 |
| 拼点骰子 | 骰子滚动动画 | P0 |
| 入场 | 新随从飞入 | P1 |
| 词条触发 | 特效光环 | P1 |
| 升级 | 金色闪光 | P2 |

## 代码实现

```typescript
// packages/web/src/game/scenes/CombatScene.ts

export class CombatScene extends Phaser.Scene {
  private followers: Map<string, Phaser.GameObjects.Sprite> = new Map()
  
  create() {
    // 创建背景
    this.add.image(400, 300, 'battlefield-bg')
  }
  
  // 播放攻击动画
  playAttackAnimation(attackerId: string, targetId: string, damage: number) {
    const attacker = this.followers.get(attackerId)
    const target = this.followers.get(targetId)
    
    if (!attacker || !target) return
    
    // 记录原始位置
    const originalX = attacker.x
    const originalY = attacker.y
    
    // 冲向目标
    this.tweens.add({
      targets: attacker,
      x: target.x - 50,
      y: target.y,
      duration: 200,
      ease: 'Power1',
      onComplete: () => {
        // 攻击命中
        this.playHitEffect(target)
        this.showDamageNumber(target.x, target.y, damage)
        
        // 返回原位
        this.tweens.add({
          targets: attacker,
          x: originalX,
          y: originalY,
          duration: 200,
          ease: 'Power1'
        })
      }
    })
  }
  
  // 受击效果
  playHitEffect(target: Phaser.GameObjects.Sprite) {
    // 抖动
    this.tweens.add({
      targets: target,
      x: target.x + 5,
      duration: 50,
      yoyo: true,
      repeat: 3
    })
    
    // 闪红
    target.setTint(0xff0000)
    this.time.delayedCall(200, () => {
      target.clearTint()
    })
  }
  
  // 显示伤害数字
  showDamageNumber(x: number, y: number, damage: number) {
    const text = this.add.text(x, y - 30, `-${damage}`, {
      fontSize: '24px',
      color: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    // 飘字动画
    this.tweens.add({
      targets: text,
      y: y - 80,
      alpha: 0,
      duration: 1000,
      ease: 'Power1',
      onComplete: () => text.destroy()
    })
  }
  
  // 骰子滚动动画
  playDiceRoll(callback: (value: number) => void) {
    const dice = this.add.sprite(400, 300, 'dice', 0)
    
    // 快速切换帧
    let frame = 0
    const interval = setInterval(() => {
      frame = (frame + 1) % 6
      dice.setFrame(frame)
    }, 100)
    
    // 停止并显示结果
    this.time.delayedCall(1000, () => {
      clearInterval(interval)
      const result = Math.floor(Math.random() * 6) + 1
      dice.setFrame(result - 1)
      
      // 放大效果
      this.tweens.add({
        targets: dice,
        scale: 1.5,
        duration: 200,
        yoyo: true,
        onComplete: () => {
          callback(result)
          dice.destroy()
        }
      })
    })
  }
}
```

## 验收标准

- [ ] 攻击动画流畅
- [ ] 伤害数字清晰可见
- [ ] 骰子动画随机
- [ ] 特效不卡顿

## 依赖关系

依赖 [04-内容扩展层](../04-内容扩展层/)
