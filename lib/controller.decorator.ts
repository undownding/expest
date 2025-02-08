import { CONTROLLER_METADATA_KEY } from './internal/metakeys'
import { normalizeRoutePath } from './internal/path.utils'

export function Controller(basePath: string) {
  const normalizedPath = normalizeRoutePath(basePath)
  return function (target: any) {
    Reflect.defineMetadata(CONTROLLER_METADATA_KEY, normalizedPath, target)
  }
}
