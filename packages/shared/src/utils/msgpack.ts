import { Packr, Unpackr } from 'msgpackr'

// 创建配置好的 msgpackr 实例
export const msgpackr = new Packr({
  structuredClone: true, // 支持循环引用和更多类型
  bundleStrings: true, // 优化字符串编码
  useRecords: true, // 使用记录而不是对象（如果可能）
  encodeUndefinedAsNil: true, // 将 undefined 编码为 nil
  int64AsNumber: true, // 将 64 位整数作为数字处理（JavaScript 安全）
})

export const unpackr = new Unpackr({
  structuredClone: true,
  useRecords: false, // 解码为普通对象
  bundleStrings: true,
})

// 类型别名
export type MsgPack = typeof msgpackr

/**
 * 序列化任何数据为 Uint8Array
 */
export function encode<T = any>(data: T): Uint8Array {
  try {
    return msgpackr.encode(data)
  } catch (error) {
    console.error('Failed to encode with msgpackr:', error)
    throw new Error(`MessagePack encoding failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * 反序列化 Uint8Array 为数据
 */
export function decode<T = any>(buffer: Uint8Array): T {
  try {
    return unpackr.decode(buffer) as T
  } catch (error) {
    console.error('Failed to decode with unpackr:', error)
    throw new Error(`MessagePack decoding failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * 序列化为 base64 字符串
 */
export function encodeToBase64<T = any>(data: T): string {
  const buffer = encode(data)
  return btoa(String.fromCharCode(...buffer))
}

/**
 * 从 base64 字符串反序列化
 */
export function decodeFromBase64<T = any>(base64: string): T {
  const binaryString = atob(base64)
  const buffer = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    buffer[i] = binaryString.charCodeAt(i)
  }
  return decode(buffer)
}

/**
 * 序列化为十六进制字符串（用于调试）
 */
export function encodeToHex<T = any>(data: T): string {
  const buffer = encode(data)
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * 从十六进制字符串反序列化
 */
export function decodeFromHex<T = any>(hex: string): T {
  const buffer = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    buffer[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return decode(buffer)
}

/**
 * 比较序列化大小（用于性能监控）
 */
export function getSerializedSize<T = any>(data: T): number {
  return encode(data).length
}

/**
 * 计算序列化压缩比（相对于 JSON）
 */
export function getCompressionRatio<T = any>(data: T): number {
  const jsonSize = JSON.stringify(data).length
  const msgpackSize = getSerializedSize(data)

  if (jsonSize === 0) return 1
  return msgpackSize / jsonSize
}

/**
 * 性能测试：序列化/反序列化速度
 */
export async function benchmark<T = any>(data: T, iterations: number = 1000): Promise<{
  encodeTime: number
  decodeTime: number
  avgEncodeTime: number
  avgDecodeTime: number
  size: number
  jsonSize: number
  compressionRatio: number
}> {
  const startEncode = performance.now()
  let encoded: Uint8Array

  for (let i = 0; i < iterations; i++) {
    encoded = encode(data)
  }
  const encodeTime = performance.now() - startEncode

  const startDecode = performance.now()
  for (let i = 0; i < iterations; i++) {
    decode(encoded!)
  }
  const decodeTime = performance.now() - startDecode

  const jsonSize = JSON.stringify(data).length
  const size = encoded!.length

  return {
    encodeTime,
    decodeTime,
    avgEncodeTime: encodeTime / iterations,
    avgDecodeTime: decodeTime / iterations,
    size,
    jsonSize,
    compressionRatio: size / jsonSize,
  }
}

// 默认导出
export default {
  encode,
  decode,
  encodeToBase64,
  decodeFromBase64,
  encodeToHex,
  decodeFromHex,
  getSerializedSize,
  getCompressionRatio,
  benchmark,
}