import type { Lock } from "redlock"
import type { GameData, MatchData } from "../server-websocket/game/type"
import type { accountTable } from "../db/tables/account"
import type { CaptchaInfo } from "../apis/account"
import type { Callback } from "ioredis"
import type { Queue, Job, JobsOptions } from "bullmq"
import type { workerHandler } from "./worker"
import type { Delta } from "jsondiffpatch"
import type { DeepReadonly } from "vue"


type WorkerMap = typeof workerHandler

/** 字符串缓存 */
type RedisStrMap = {
  /** user-channel:${用户ID}: bun实例ID */
  [k in `user-channel:${number}`]: string
} & {
  /** player-match:${用户ID}: 用户匹配中的游戏ID */
  [k in `player-match:${number}`]: string
} & {
  /** player-game:${用户ID}: 用户所在游戏的ID */
  [k in `player-game:${number}`]: string
}

/** 二进制缓存 */
type RedisBufMap = {}

/** JSON 缓存 */
type RedisJsonMap = {
  /** captcha-email:${邮箱}: 邮件信息 */
  [k in `captcha-email:${string}`]: CaptchaInfo
} & {
  /** token:登录凭证: 用户信息 */
  [k in `token:${string}`]: typeof accountTable.$inferSelect
} & {
  /** match:${段位}: 匹配信息 */
  [k in `match:${string}`]: MatchData
} & {
  /** game:${游戏ID}: 游戏信息 */
  [k in `game:${number}`]: GameData
}

/** 无序集合缓存 */
type RedisSetMap = {}

/** 哈希缓存 */
type RedisHashMap = {}

/** 列表缓存 */
type RedisListMap = {
  /** game-delta-set:${游戏ID}: 游戏数据变更集合 */
  [k in `game-delta:${number}`]: Delta
}

type RedisKey = keyof (RedisStrMap & RedisJsonMap & RedisSetMap & RedisListMap & RedisHashMap)

// 辅助类型：拼接路径
type JoinPath<Prev extends string, Key extends string | number> = Prev extends '' ? `.${Key}` : `${Prev}.${Key}`

// 深度计数器类型
type Depth = [never, 0, 1, 2, 3, 4, 5]

// 获取所有可能的路径
type GetValuePath<T, Prev extends string = '', D extends number = 4> = [D] extends [never]
  ? never
  : T extends (infer U)[] // 数组类型
  ? Prev extends ''
  ? '.' | `.[${number}]` | GetValuePath<U, `.[${number}]`, Depth[D]>
  : Prev | `${Prev}[${number}]` | GetValuePath<U, `${Prev}[${number}]`, Depth[D]>
  : T extends object
  ?
  | (Prev extends '' ? '.' : Prev)
  | {
    [P in keyof T & (string | number)]: T[P] extends (infer U)[]
    ? `${JoinPath<Prev, P>}` | `${JoinPath<Prev, P>}[${number}]` | GetValuePath<U, `${JoinPath<Prev, P>}[${number}]`, Depth[D]>
    : T[P] extends { [k: number]: infer V } // 数字索引对象
    ? `${JoinPath<Prev, P>}` | `${JoinPath<Prev, P>}.${number}` | GetValuePath<V, `${JoinPath<Prev, P>}.${number}`, Depth[D]>
    : T[P] extends object
    ? GetValuePath<T[P], JoinPath<Prev, P>, Depth[D]>
    : JoinPath<Prev, P>
  }[keyof T & (string | number)]
  : never

type GetValue<T, P extends string> = P extends '.'
  ? T
  : P extends `.${infer Key}`
  ? Key extends `[${number}]${infer Rest}` // 处理 .[0] 格式
  ? T extends (infer U)[]
  ? Rest extends ''
  ? U
  : GetValue<U, Rest>
  : never
  : Key extends `${infer First}.${infer Rest}`
  ? First extends keyof T
  ? GetValue<T[First], `.${Rest}`>
  : First extends `${infer Prop}[${number}]`
  ? Prop extends keyof T
  ? T[Prop] extends (infer U)[]
  ? GetValue<U, `.${Rest}`>
  : never
  : never
  : First extends `${number}`
  ? T extends { [k: number]: infer V } | readonly [...any]
  ? GetValue<T[First extends keyof T ? First : never], `.${Rest}`>
  : never
  : never
  : Key extends keyof T
  ? T[Key]
  : Key extends `${infer Prop}[${number}]`
  ? Prop extends keyof T
  ? T[Prop] extends (infer U)[]
  ? U
  : never
  : never
  : Key extends `${number}`
  ? T extends { [k: number]: infer V } | readonly [...any]
  ? T[Key extends keyof T ? Key : never]
  : never
  : never
  : never

/** Redis 扩展方法类型 */
export type RedisExt = {
  /** 集群 bun/node 实例的 id，用于集群之间的通信 */
  $id: number
  /** 删除缓存 */
  $del: (k: RedisKey) => Promise<number>
  /** 获取字符串缓存 */
  $get: (k: keyof RedisStrMap) => Promise<string | null>
  /** 设置字符串缓存 */
  $set: (k: keyof RedisStrMap, v: string) => Promise<'OK'>
  /** 操作 JSON 类型 */
  $json: {
    /** 同步操作 json 数据 */
    ref: <
      RedisKey extends keyof RedisJsonMap,
      RedisValue extends RedisJsonMap[RedisKey],
      ValuePath extends GetValuePath<RedisValue>
    >(redisKey: RedisKey, redisJson?: RedisValue | DeepReadonly<RedisValue>) => Promise<JsonUpdateChain<RedisValue, ValuePath>>,
    /** 存储 JSON 缓存 */
    set: <
      //
      RedisKey extends keyof RedisJsonMap,
      RedisValue extends RedisJsonMap[RedisKey],
      ValuePath extends GetValuePath<RedisValue>,
      Value extends GetValue<RedisValue, ValuePath>
    >(
      /** redis 储存的 key */
      redisKey: RedisKey,
      /** 对象的属性路径 */
      valuePath: ValuePath,
      /** 属性值 */
      value: Value
    ) => Promise<'OK'>
    /** 为 JSON 数值缓存增加数值 */
    add: <
      //
      RedisKey extends keyof RedisJsonMap,
      RedisValue extends RedisJsonMap[RedisKey],
      ValuePath extends GetValuePath<RedisValue>
    >(
      /** redis 储存的 key */
      redisKey: RedisKey,
      /** 对象的属性路径 */
      valuePath: ValuePath,
      /** 要增加的数字 */
      addNum: number
    ) => Promise<number>
    /** 获取 JSON 缓存 */
    get: <
      //
      RedisKey extends keyof RedisJsonMap,
      RedisValue extends RedisJsonMap[RedisKey],
      ValuePath extends GetValuePath<RedisValue>,
      Value extends GetValue<RedisValue, ValuePath>
    >(
      /** redis 储存的 key */
      redisKey: RedisKey,
      /** 对象的属性路径 */
      valuePath: ValuePath
    ) => Promise<Value | null>
    /** 向数组添加元素 */
    push: <
      RedisKey extends keyof RedisJsonMap,
      RedisValue extends RedisJsonMap[RedisKey],
      ValuePath extends GetValuePath<RedisValue>,
      Value extends GetValue<RedisValue, ValuePath> extends Array<any> ? GetValue<RedisValue, ValuePath>[number] : never
    >(
      /** redis 储存的 key */
      redisKey: RedisKey,
      /** 对象的属性路径 */
      valuePath: ValuePath,
      /** 属性值 */
      ...values: Value[]
    ) => Promise<number>
    pop: <
      //
      RedisKey extends keyof RedisJsonMap,
      RedisValue extends RedisJsonMap[RedisKey],
      ValuePath extends GetValuePath<RedisValue>,
      Value extends GetValue<RedisValue, ValuePath> extends Array<any> ? GetValue<RedisValue, ValuePath>[number] : never
    >(
      /** redis 储存的 key */
      redisKey: RedisKey,
      /** 对象的属性路径 */
      valuePath: ValuePath
    ) => Promise<Value>
    /** 裁剪数组 */
    trim: <
      RedisKey extends keyof RedisJsonMap,
      RedisValue extends RedisJsonMap[RedisKey],
      ValuePath extends GetValuePath<RedisValue>,
    >(
      /** redis 储存的 key */
      redisKey: RedisKey,
      /** 对象的属性路径 */
      valuePath: ValuePath,
      /** 保留数组范围的起始索引（包含） */
      start: number,
      /** 保留范围的结束索引（包含），-1表示最后一个元素 */
      end: number
    ) => Promise<number>
    /** 获取数组长度 */
    arrlen: <
      //
      RedisKey extends keyof RedisJsonMap,
      RedisValue extends RedisJsonMap[RedisKey],
      ValuePath extends GetValuePath<RedisValue>
    >(
      /** redis 储存的 key */
      redisKey: RedisKey,
      /** 对象的属性路径 */
      valuePath: ValuePath
    ) => Promise<number>
    /** 获取对象 key 数量 */
    objlen: <
      //
      RedisKey extends keyof RedisJsonMap,
      RedisValue extends RedisJsonMap[RedisKey],
      ValuePath extends GetValuePath<RedisValue>
    >(
      /** redis 储存的 key */
      redisKey: RedisKey,
      /** 对象的属性路径 */
      valuePath: ValuePath
    ) => Promise<number>
    /** 删除 JSON 某字段 */
    del: <
      //
      RedisKey extends keyof RedisJsonMap,
      RedisValue extends RedisJsonMap[RedisKey],
      ValuePath extends GetValuePath<RedisValue>
    >(
      /** redis 储存的 key */
      redisKey: RedisKey,
      /** 对象的属性路径 */
      valuePath: ValuePath
    ) => Promise<'OK'>
  },
  /** 操作 Buffer 类型 */
  $buf: {
    /** 缓存二进制内容 */
    set: <K extends keyof RedisBufMap>(k: K, v: RedisBufMap[K]) => Promise<Buffer<ArrayBufferLike> | null>
    /** 获取二进制缓存 */
    get: <K extends keyof RedisBufMap>(k: K) => Promise<RedisBufMap[K]>
    /** 无序集合 */
    Set: {
      add: <K extends keyof RedisSetMap>(k: K, ...members: (RedisSetMap[K])[]) => Promise<number>,
      rem: <K extends keyof RedisSetMap>(k: K, ...members: (RedisSetMap[K])[]) => Promise<number>
      members: <K extends keyof RedisSetMap>(k: K) => Promise<RedisSetMap[K][]>
    },
    /** 列表 */
    list: {
      get: <K extends keyof RedisListMap>(k: K, start: number, stop: number) => Promise<RedisListMap[K][]>,
      push: <K extends keyof RedisListMap>(k: K, ...members: (RedisListMap[K])[]) => Promise<number>,
      unshift: <K extends keyof RedisListMap>(k: K, ...members: (RedisListMap[K])[]) => Promise<number>
    }
  }
  $expire: <K extends RedisKey>(k: K, seconds: number | string, callback?: Callback<number>) => Promise<number>

  /**
   * 将多个命令打包一同执行
   * - 没有事务性，一般只用在需要获取多个缓存的时候使用
   * - 需要修改缓存的话，推荐用 multi 确保事务性
   */
  $pipeline: () => {
    get: <K extends keyof RedisStrMap> (k: K, cb?: (string) => any) => ReturnType<RedisExt['$pipeline']>
    /** 获取 JSON 缓存 */
    json: {
      get: <
        RedisKey extends keyof RedisJsonMap,
        RedisValue extends RedisJsonMap[RedisKey],
        ValuePath extends GetValuePath<RedisValue>
      >(
        k: RedisKey,
        valuePath: ValuePath,
        cb?: (v: RedisValue) => any
      ) => ReturnType<RedisExt['$pipeline']>
      exec: <Res = any>() => Promise<Res[]>
    },
    /** 获取二进制缓存 */
    buf: {
      get: <K extends keyof RedisBufMap>(k: K, cb?: (v: RedisBufMap[K]) => any) => ReturnType<RedisExt['$pipeline']>
      /** 无序集合 */
      Set: {
        <K extends keyof RedisSetMap>(k: K, cb?: (v: RedisSetMap[K]) => any): ReturnType<RedisExt['$pipeline']>
      },
      /** 列表 */
      list: {
        <K extends keyof RedisListMap>(key: K, start: number, stop: number, cb?: (v: RedisListMap[K]) => any): ReturnType<RedisExt['$pipeline']>
      },
    },
    smembers: (k: keyof RedisStrMap, cb?: (v: string) => any) => ReturnType<RedisExt['$pipeline']>
    exec: () => Promise<string[]>
  }

  /**
   * 将多个命令打包一同执行
   * - 有事务性，如果其中一个命令失败则全部命令失败
   * - 如果只需要获取缓存，并不需要修改缓存推荐使用 pipeline 以获取更高的性能
   */
  $multi: () => {
    /** 设置缓存 */
    set: <K extends keyof RedisStrMap, V extends RedisStrMap[K]>(k: K, v: V) => ReturnType<RedisExt['$multi']>
    /** 删除缓存 */
    del: <K extends RedisKey>(...ks: K[]) => ReturnType<RedisExt['$multi']>
    buf: {
      /** 无序集合 */
      Set: {
        /** 集合添加成员 */
        add: <K extends keyof RedisSetMap>(k: K, ...members: (RedisSetMap[K])[]) => ReturnType<RedisExt['$multi']>
        /** 集合删除成员 */
        rem: <K extends keyof RedisSetMap>(k: K, ...members: (RedisSetMap[K])[]) => ReturnType<RedisExt['$multi']>
      },
      list: {
        push: <K extends keyof RedisListMap>(k: K, ...members: (RedisListMap[K])[]) => ReturnType<RedisExt['$multi']>,
        unshift: <K extends keyof RedisListMap>(k: K, ...members: (RedisListMap[K])[]) => ReturnType<RedisExt['$multi']>
      }
    }
    json: {
      /** 为 json 的某字段赋值 */
      set: <
        RedisKey extends keyof RedisJsonMap,
        RedisValue extends RedisJsonMap[RedisKey],
        ValuePath extends GetValuePath<RedisValue>,
        Value extends GetValue<RedisValue, ValuePath>
      >(
        redisKey: RedisKey,
        valuePath: ValuePath,
        value: Value
      ) => ReturnType<RedisExt['$multi']>
      /** 为数字类型的值增加指定数值 */
      add: <
        RedisKey extends keyof RedisJsonMap,
        RedisValue extends RedisJsonMap[RedisKey],
        ValuePath extends GetValuePath<RedisValue>
      >(
        redisKey: RedisKey,
        valuePath: ValuePath,
        addNum: number
      ) => ReturnType<RedisExt['$multi']>
      /** 向数组末尾添加元素 */
      push: <
        RedisKey extends keyof RedisJsonMap,
        RedisValue extends RedisJsonMap[RedisKey],
        ValuePath extends GetValuePath<RedisValue>,
        Value extends GetValue<RedisValue, ValuePath> extends Array<any> ? GetValue<RedisValue, ValuePath>[number] : never
      >(
        redisKey: RedisKey,
        valuePath: ValuePath,
        ...values: Value[]
      ) => ReturnType<RedisExt['$multi']>
      /** 移除数组末尾元素 */
      pop: <
        RedisKey extends keyof RedisJsonMap,
        RedisValue extends RedisJsonMap[RedisKey],
        ValuePath extends GetValuePath<RedisValue>,
        Value extends GetValue<RedisValue, ValuePath> extends Array<any> ? GetValue<RedisValue, ValuePath>[number] : never
      >(
        redisKey: RedisKey,
        valuePath: ValuePath,
        ...values: Value[]
      ) => ReturnType<RedisExt['$multi']>
      /** 裁剪数组 */
      trim: <
        RedisKey extends keyof RedisJsonMap,
        RedisValue extends RedisJsonMap[RedisKey],
        ValuePath extends GetValuePath<RedisValue>,
      >(
        /** redis 储存的 key */
        redisKey: RedisKey,
        /** 对象的属性路径 */
        valuePath: ValuePath,
        /** 保留数组范围的起始索引（包含） */
        start: number,
        /** 保留范围的结束索引（包含），-1表示最后一个元素 */
        end: number
      ) => ReturnType<RedisExt['$multi']>
      del: <
        //
        RedisKey extends keyof RedisJsonMap,
        RedisValue extends RedisJsonMap[RedisKey],
        ValuePath extends GetValuePath<RedisValue>
      >(
        redisKey: RedisKey,
        valuePath: ValuePath
      ) => ReturnType<RedisExt['$multi']>
    },
    exec: () => Promise<[error: Error | null, result: unknown][] | null>
  }


  /** 队列 */
  $queue: Omit<Queue, 'add'> & {
    add: <
      Name extends keyof WorkerMap,
      Data extends Parameters<WorkerMap[Name]>[0]
    >(
      name: Name, data: Data, opts?: JobsOptions
    ) => Promise<Job<any, unknown, string>>
  },

  /** 设置分布式锁 */
  $lock: (key: string, cb: (lock: Lock) => any, ttl?: number) => Promise<Lock>
}

interface JsonUpdateChain<RedisValue, ValuePath> {
  /** 一开始的数据 */
  oldData: DeepReadonly<RedisValue | null>
  /** 修改后的数据 */
  data: DeepReadonly<RedisValue>
  /** 修改 json 的指定字段的缓存 */
  set: <P extends ValuePath>(p: P, v: GetValue<RedisValue, P & string>) => JsonUpdateChain<RedisValue, ValuePath>
  /** 删除缓存 */
  del: <P extends ValuePath>(p: P) => JsonUpdateChain<RedisValue, ValuePath>
  /** 增加数字 */
  add: <P extends ValuePath>(p: P, n: number) => JsonUpdateChain<RedisValue, ValuePath>
  // /** 执行 */
  exec: () => Promise<JsonUpdateChain<RedisValue, ValuePath>>
  multi: ReturnType<RedisExt['$multi']>
}
