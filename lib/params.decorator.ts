import 'reflect-metadata'
import { PARAM_METADATA_KEY } from './internal/metakeys'
import { type ParamType } from './internal/param.type'

function createParamDecorator(paramType: ParamType, key?: string) {
  return (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) => {
    const existingParams: ParamMetadata[] =
      Reflect.getOwnMetadata(PARAM_METADATA_KEY, target, propertyKey) || []

    // 获取参数的类型
    const paramTypes =
      Reflect.getMetadata('design:paramtypes', target, propertyKey) || []
    const paramTypeClass = paramTypes[parameterIndex] // 获取当前参数的类型

    existingParams[parameterIndex] = { paramType, key, paramTypeClass }

    Reflect.defineMetadata(
      PARAM_METADATA_KEY,
      existingParams,
      target,
      propertyKey,
    )
  }
}

// 具体装饰器
export const Body = () => createParamDecorator('body')
export const Param = (key?: string) => createParamDecorator('param', key)
export const Query = (key?: string) => createParamDecorator('query', key)

// 参数元数据接口
export interface ParamMetadata {
  paramType: ParamType
  key?: string
  paramTypeClass: any
}
