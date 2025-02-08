import express, { Express, Request, Response, Router } from 'express'
import { ParamMetadata } from './params.decorator'
import { plainToInstance } from 'class-transformer'
import {
  CONTROLLER_METADATA_KEY,
  PARAM_METADATA_KEY,
  ROUTE_METADATA_KEY,
} from './internal/metakeys'
import { ParamType } from './internal/param.type'
import path from 'path'
import { validateSync } from 'class-validator'
import * as console from 'node:console'
import 'reflect-metadata'

export function registerControllers(app: Express, controllers: any[]) {
  app.use(express.json())

  controllers.forEach((ControllerClass) => {
    const controller = new ControllerClass()
    const basePath = Reflect.getMetadata(
      CONTROLLER_METADATA_KEY,
      ControllerClass,
    )
    const routes = Reflect.getMetadata(ROUTE_METADATA_KEY, controller) || []

    const router = Router()

    routes.forEach((route: any) => {
      const { method, path: routePath, handler } = route

      const fullPath = path.posix.join(basePath, routePath)

      // 新的路由处理函数（支持自动参数注入和响应）
      const routeHandler = async (req: Request, res: Response) => {
        try {
          const paramMetadata: ParamMetadata[] =
            Reflect.getMetadata(PARAM_METADATA_KEY, controller, handler.name) ||
            []

          // 获取参数类型（可能为 undefined）
          const paramTypes: any[] =
            Reflect.getMetadata(
              'design:paramtypes',
              controller,
              handler.name,
            ) || []

          const validationErrors = []
          const args = paramMetadata.map((meta, index) => {
            const { paramType, key } = meta
            const paramValue = getParamValue(req, paramType, key)
            const targetType = paramTypes[index] || Object // 默认不转换
            const dto = convertType(paramValue, targetType)
            if (typeof dto === 'object') {
              validationErrors.push(
                validateSync(dto, {
                  skipMissingProperties: true,
                }),
              )
            }
            return dto
          })

          if (validationErrors.some((errors) => errors.length > 0)) {
            console.log(validationErrors)
            res.status(400).json({
              message: 'Validation failed',
              errors: validationErrors,
            })
          } else {
            const result = await handler.apply(controller, args)
            res.json(result)
          }
        } catch (err) {
          console.error(err)
          res.status(500).json({ message: err.message })
        }
      }

      router[method](fullPath, routeHandler)
    })

    app.use('/', router)
  })
}

// 从 Request 中提取参数值
function getParamValue(req: Request, paramType: ParamType, key?: string) {
  switch (paramType) {
    case 'param':
      return key ? req.params[key] : req.params
    case 'body':
      return req.body
    case 'query':
      return key ? req.query[key] : req.query
    default:
      return undefined
  }
}

function convertType(value: any, targetType: any) {
  if (typeof value === 'object') {
    return plainToInstance(targetType, value)
  }
  if (targetType === Number && typeof value === 'string') {
    return parseInt(value, 10)
  }
  if (targetType === Boolean && typeof value === 'string') {
    return value === 'true'
  }
  return value
}
