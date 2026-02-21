// Phaser 类型扩展，用于与共享类型集成

import { Vector2, type Player, type GameObject } from './game'

// Phaser 配置扩展
export type PhaserGameConfig = {
  type: number // Phaser.CANVAS, Phaser.WEBGL, etc.
  width: number
  height: number
  parent: string
  backgroundColor: string
  physics: {
    default: string
    arcade: {
      gravity: {
        x: number
        y: number
      }
      debug: boolean
    }
  }
  scale: {
    mode: number // Phaser.Scale.FIT, etc.
    autoCenter: number // Phaser.Scale.CENTER_BOTH
  }
  scene: any[]
}

// Phaser 游戏对象包装器
export type PhaserPlayer = Player & {
  sprite: any // Phaser.GameObjects.Sprite
  body: any // Phaser.Physics.Arcade.Body
  animations: Map<string, any> // 动画映射
}

export type PhaserGameObject = GameObject & {
  sprite: any // Phaser.GameObjects.Sprite | Phaser.GameObjects.Container
  body?: any // Phaser.Physics.Arcade.Body (如果有物理属性)
}

// 场景接口
export interface GameScene {
  preload(): void
  create(): void
  update(time: number, delta: number): void
}

// 资源定义
export type AssetConfig = {
  key: string
  url: string
  type: 'image' | 'spritesheet' | 'audio' | 'tilemap' | 'json'
  frameConfig?: {
    frameWidth: number
    frameHeight: number
  }
}

// 动画定义
export type AnimationConfig = {
  key: string
  frames: any[] // Phaser.Animations.AnimationFrame[]
  frameRate: number
  repeat: number
  yoyo?: boolean
}

// 游戏事件常量
export enum PhaserGameEvents {
  PlayerCreated = 'player-created',
  PlayerMoved = 'player-moved',
  PlayerAction = 'player-action',
  ObjectCollision = 'object-collision',
  GameStateUpdated = 'game-state-updated',
  NetworkEvent = 'network-event',
}

// 工具类型：将共享类型转换为 Phaser 兼容格式
export const toPhaserVector = (vec: Vector2): { x: number; y: number } => ({
  x: vec.x,
  y: vec.y,
})

export const fromPhaserVector = (vec: { x: number; y: number }): Vector2 => ({
  x: vec.x,
  y: vec.y,
})

export const toPhaserRectangle = (rect: { x: number; y: number; width: number; height: number }) => ({
  x: rect.x,
  y: rect.y,
  width: rect.width,
  height: rect.height,
})

// Phaser 特定常量
export const PHASER_CONSTANTS = {
  SCALE_MODES: {
    FIT: 0,
    FILL: 1,
    RESIZE: 2,
  },
  AUTO_CENTER: {
    NO_CENTER: 0,
    CENTER_BOTH: 1,
    CENTER_HORIZONTALLY: 2,
    CENTER_VERTICALLY: 3,
  },
  PHYSICS: {
    ARCADE: 'arcade',
    MATTER: 'matter',
    IMPACT: 'impact',
  },
} as const