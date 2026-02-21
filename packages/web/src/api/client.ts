
export interface ApiConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  params?: Record<string, any>
  data?: any
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer'
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface ApiClient {
  request<T = any>(url: string, options?: ApiRequestOptions): Promise<T>
  get<T = any>(url: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T>
  post<T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'data'>): Promise<T>
  put<T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'data'>): Promise<T>
  delete<T = any>(url: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T>
}

export function createClient(config?: Partial<ApiConfig>): ApiClient {
  const {
    baseURL = import.meta.env.VITE_API_URL || '/api',
    timeout = 30000,
    headers = {},
  } = config || {}

  // 从 localStorage 获取 token
  function getAuthToken(): string | null {
    return localStorage.getItem('game_token')
  }

  // 构建请求头
  function buildHeaders(customHeaders?: Record<string, string>): HeadersInit {
    const authToken = getAuthToken()
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
      ...customHeaders,
    }

    if (authToken) {
      defaultHeaders['Authorization'] = `Bearer ${authToken}`
    }

    return defaultHeaders
  }

  // 处理响应
  async function handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')

    let data: any
    if (contentType?.includes('application/json')) {
      data = await response.json()
    } else if (contentType?.includes('text/')) {
      data = await response.text()
    } else {
      data = await response.blob()
    }

    if (!response.ok) {
      throw new ApiError(
        data?.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        data
      )
    }

    return data
  }

  // 核心请求方法
  async function request<T = any>(url: string, options: ApiRequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      headers: customHeaders = {},
      params,
      data,
    } = options

    // 构建完整 URL
    let fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`

    // 添加查询参数
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, String(v)))
          } else {
            searchParams.append(key, String(value))
          }
        }
      })
      const queryString = searchParams.toString()
      if (queryString) {
        fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString
      }
    }

    // 构建请求配置
    const requestOptions: RequestInit = {
      method,
      headers: buildHeaders(customHeaders),
      credentials: 'include',
    }

    // 添加请求体
    if (data !== undefined) {
      requestOptions.body = JSON.stringify(data)
    }

    // 创建 AbortController 用于超时
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    requestOptions.signal = controller.signal

    try {
      const response = await fetch(fullUrl, requestOptions)
      clearTimeout(timeoutId)
      return await handleResponse<T>(response)
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError(`Request timeout after ${timeout}ms`)
      }

      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0,
        error
      )
    }
  }

  // 便捷方法
  async function get<T = any>(url: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return request<T>(url, { method: 'GET', ...options })
  }

  async function post<T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'data'>): Promise<T> {
    return request<T>(url, { method: 'POST', data, ...options })
  }

  async function put<T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'data'>): Promise<T> {
    return request<T>(url, { method: 'PUT', data, ...options })
  }

  async function delete_<T = any>(url: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return request<T>(url, { method: 'DELETE', ...options })
  }

  // 返回客户端实例
  return {
    request,
    get,
    post,
    put,
    delete: delete_,
  }
}

// 默认导出
export default createClient