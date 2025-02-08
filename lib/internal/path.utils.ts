import path from 'path'

/**
 * 规范化路径，确保以 / 开头且没有重复斜杠
 * @example normalizeRoutePath('users') => '/users'
 */
export function normalizeRoutePath(routePath: string): string {
  if (routePath === '') return '/'
  // 使用 Node.js 的 path.posix 处理 URL 路径
  return path.posix.join('/', routePath)
}
