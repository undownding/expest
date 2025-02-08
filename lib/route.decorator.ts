import 'reflect-metadata'
import { ROUTE_METADATA_KEY } from './internal/metakeys'
import { normalizeRoutePath } from './internal/path.utils'

function Route(method: string, path: string = '/') {
  // 规范化路由路径
  const normalizedPath = normalizeRoutePath(path)
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const routes = Reflect.getMetadata(ROUTE_METADATA_KEY, target) || []
    routes.push({ method, path: normalizedPath, handler: descriptor.value })
    Reflect.defineMetadata(ROUTE_METADATA_KEY, routes, target)
  }
}

export function Get(path?: string) {
  return Route('get', path)
}

export function Post(path?: string) {
  return Route('post', path)
}
