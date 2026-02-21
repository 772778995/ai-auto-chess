// 游戏常量

// 网络常量
export const NETWORK = {
  MAX_PACKET_SIZE: 1024 * 1024, // 1MB
  HEARTBEAT_INTERVAL: 30000, // 30秒
  RECONNECT_DELAY: 5000, // 5秒
  MAX_RECONNECT_ATTEMPTS: 5,
  TIMEOUT: 10000, // 10秒
} as const

// 游戏常量
export const GAME = {
  TICK_RATE: 60, // 每秒60次更新
  MAX_PLAYERS: 10,
  WORLD_WIDTH: 1920,
  WORLD_HEIGHT: 1080,
  GRAVITY: 9.8,
  FRICTION: 0.8,
  PLAYER: {
    SPEED: 300,
    JUMP_FORCE: 500,
    HEALTH_MAX: 100,
  },
} as const

// 物理常量
export const PHYSICS = {
  COLLISION_CATEGORIES: {
    DEFAULT: 0x0001,
    PLAYER: 0x0002,
    ENEMY: 0x0004,
    PROJECTILE: 0x0008,
    WALL: 0x0010,
    COLLECTIBLE: 0x0020,
    TRIGGER: 0x0040,
  } as const,
  GRAVITY_SCALE: 100, // Phaser 中的比例因子
} as const

// 消息类型常量
export const MESSAGE_TYPES = {
  // 网络消息
  HANDSHAKE: 'handshake',
  AUTH: 'auth',
  PING: 'ping',
  PONG: 'pong',

  // 游戏消息
  GAME_STATE: 'game_state',
  PLAYER_INPUT: 'player_input',
  PLAYER_ACTION: 'player_action',
  PLAYER_JOIN: 'player_join',
  PLAYER_LEAVE: 'player_leave',

  // 事件消息
  CHAT_MESSAGE: 'chat_message',
  GAME_EVENT: 'game_event',
  ERROR: 'error',
} as const

// 错误代码
export const ERROR_CODES = {
  // 网络错误
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  CONNECTION_LOST: 'CONNECTION_LOST',
  INVALID_MESSAGE: 'INVALID_MESSAGE',

  // 游戏错误
  GAME_FULL: 'GAME_FULL',
  INVALID_PLAYER: 'INVALID_PLAYER',
  INVALID_ACTION: 'INVALID_ACTION',

  // 认证错误
  AUTH_FAILED: 'AUTH_FAILED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
} as const

// 事件名称
export const EVENT_NAMES = {
  // 游戏事件
  PLAYER_SPAWNED: 'player-spawned',
  PLAYER_MOVED: 'player-moved',
  PLAYER_ATTACKED: 'player-attacked',
  PLAYER_DAMAGED: 'player-damaged',
  PLAYER_DIED: 'player-died',
  PLAYER_RESPAWNED: 'player-respawned',

  // 世界事件
  OBJECT_SPAWNED: 'object-spawned',
  OBJECT_DESPAWNED: 'object-despawned',
  OBJECT_COLLISION: 'object-collision',

  // 网络事件
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting',
  MESSAGE_RECEIVED: 'message-received',
} as const

// 默认配置
export const DEFAULT_CONFIG = {
  GAME: GAME,
  NETWORK: NETWORK,
  PHYSICS: PHYSICS,
} as const